import Product from "./product.ts"
import saleCheckFindProduct from "./sql/salecheckFindProduct.sql"
import saleCheckInsertItem from "./sql/salecheckInsertItem.sql"
import saleCheckListSimple from "./sql/saleCheckListSimple.sql"
import selectProductWithPrice from "./sql/selectProductWithPrice.sql"

export interface ProductWithPrice {
  productId: int;
  barcode: string;
  title: string;
  price: number;
}

export interface SaleCheckItem {
  productId: int;
  quantity: long;
  price: long;
  unitId: int;
  currencyId: int;
  createdAt: datetime;
}

export interface SaleCheckState {
  list: Array,
  items: Array[SaleCheckItem];
  itemsCost: number;
  currentItem: SaleCheckItem;
  priceNotSet: boolean;
  lastItemTitle: string;
  lastItemBarcode: string;
}

const currentSaleCheckProductFound = (product) => ({
  type: "SALECHECK_PRODUCT_FOUND",
  product: product,
});

const currentSaleCheckProductNotFound = () => ({
  type: "SALECHECK_PRODUCT_NOT_FOUND",
});

const saleCheckClosed = () => ({
  type: "SALECHECK_CLOSED",
});

const saleCheckListUpdated = (list) => ({
  type: "SALECHECK_LIST_UPDATED",
  list: list,
})

function addSaleCheckItem(barcode) {
  return function (dispatch, getState, { db }) {
    if (barcode.length > 0) {
      db.selectOne(selectProductWithPrice, [ barcode ])
        .then(foundProduct => {
          if (foundProduct) {
            dispatch(currentSaleCheckProductFound(foundProduct));
          } else {
            dispatch(currentSaleCheckProductNotFound());
          }
        })
    } else {
      dispatch(currentSaleCheckProductNotFound());
    }
  };
}

function toMoney(num) {
  return Math.round(num * 100 + Number.EPSILON);
}

function closeSaleCheck(cash, change) {
  return function (dispatch, getState, { db }) {
    const { saleCheck: { items } } = getState();
    return Promise.resolve()
      .then(_ => db.exec("begin"))
      .then(_ => db.exec("insert into salecheck(cash, change) values(?, ?)", [ cash, change ]))
      .then(_ => db.selectOne("select id as saleCheckId from salecheck where id in (select max(id) from salecheck)"))
      .then(({ saleCheckId }) => (
        Promise.all(items.map(item => (
          db.exec(saleCheckInsertItem, {
            $saleCheckId: saleCheckId,
            $productId: item.productId,
            $quantity: item.quantity,
            $price: toMoney(item.price),
            $discount: 0,
            $unitId: item.unitId,
            $currencyId: item.currencyId
          }).then(_ => saleCheckId)
        )))))
      .then(saleCheckId => db.exec("update salecheck set closed = true where id = ?", [ saleCheckId ]))
      .then(_ => db.exec("commit"))
      .then(_ => dispatch(saleCheckClosed()))
      .then(_ => db.select(saleCheckListSimple))
      .then(list => dispatch(saleCheckListUpdated(list)))
      .catch(err => {
        console.log(err);
        return db.exec("rollback");
      })
  };
}

function updateSaleCheckList() {
  return function (dispatch, getState, { db }) {
    return Promise.resolve()
      .then(_ => db.select(saleCheckListSimple))
      .then(list => dispatch(saleCheckListUpdated(list)))
      .catch(err => {
        console.log(err);
      })
  };
}

function decSaleCheckItemQuantity(barcode) {
  return {
    type: "SALECHECK_ITEM_DEC",
    barcode: barcode,
  };
}

function incSaleCheckItemQuantity(barcode) {
  return {
    type: "SALECHECK_ITEM_INC",
    barcode: barcode,
  };
}

const SaleCheckActions = {
  addSaleCheckItem: addSaleCheckItem,
  incSaleCheckItemQuantity: incSaleCheckItemQuantity,
  decSaleCheckItemQuantity: decSaleCheckItemQuantity,
  closeSaleCheck: closeSaleCheck,
  updateSaleCheckList: updateSaleCheckList,
}

const emptySaleCheckItem = {
  productId: -1,
  quantity: 0,
  price: 0,
  unitId: -1,
  currencyId: -1,
  createdAt: null,
};

const emptyProductWithPrice = {
  id: -1,
  barcode: "",
  title: "",
  price: -1,
}

function SaleCheckReducer (state: SaleCheckState = {
  list: [],
  items: [],
  itemsCost: 0.00,
  currentSaleCheckItem: emptySaleCheckItem,
  priceNotSet: false,
  lastItemTitle: "",
  lastItemBarcode: "",
}, action) {
  switch (action.type) {
    case 'SALECHECK_PRODUCT_FOUND':
      const items = state.items;
      const product = action.product;
      const saleCheckItem = {
        productId: product.id,
        barcode: product.barcode,
        title: product.title,
        quantity: 1,
        price: product.price,
        unitId: 1,
        currencyId: 1,
      }
      /* If product is in the check, then just increase quantity */
      const existingIndex = items.findIndex(i => i.productId === product.id);
      const newItems = (existingIndex >= 0) ?
        items.map(i => (i.productId === product.id) ? Object.assign({}, i, { quantity: i.quantity + 1 }) : i) :
        [ ... items, saleCheckItem ]
      ;
      const sum = newItems.map(i => i.price * i.quantity).reduce((a, b) => a + b);
      const priceNotSet = product.price <= 0;
      return Object.assign({}, state, {
        currentSaleCheckItem: saleCheckItem,
        items: priceNotSet ? state.items : newItems,
        itemsCost: Math.round((sum + Number.EPSILON) * 100) / 100,
        priceNotSet: priceNotSet,
        lastItemTitle: saleCheckItem.title,
        lastItemBarcode: saleCheckItem.barcode,
      });
    case 'SALECHECK_PRODUCT_NOT_FOUND':
      return Object.assign({}, state, { currentSaleCheckItem: emptySaleCheckItem });
    case 'SALECHECK_ITEM_DEC': {
      const newItems = state.items.map(i =>
        (i.barcode == action.barcode) ?
          Object.assign({}, i, { quantity: i.quantity - 1 }) : i
      ).filter(i => (i.quantity > 0))
      const sum = (newItems.length > 0) ? newItems.map(i => i.price * i.quantity).reduce((a, b) => a + b) : 0.00;
      return Object.assign({}, state, {
        items: newItems,
        itemsCost: Math.round((sum + Number.EPSILON) * 100) / 100,
      });
    }
    case 'SALECHECK_ITEM_INC': {
      const newItems = state.items.map(i =>
        (i.barcode == action.barcode) ?
          Object.assign({}, i, { quantity: i.quantity + 1 }) : i
      )
      const sum = newItems.map(i => i.price * i.quantity).reduce((a, b) => a + b);
      return Object.assign({}, state, {
        items: newItems,
        itemsCost: Math.round((sum + Number.EPSILON) * 100) / 100,
      });
    }
    case 'SALECHECK_LIST_UPDATED': {
      return Object.assign({}, state, {
        list: action.list,
      });
    }
    case 'SALECHECK_CLOSED': {
      return Object.assign({}, state, {
        currentSaleCheckItem: emptySaleCheckItem,
        items: [],
        itemsCost: 0.00,
      });
    }
    default:
      return state
  }
}

export { SaleCheckActions, SaleCheckReducer };
