import Product from "./product.ts"
import saleCheckFindProduct from "./sql/salecheckFindProduct.sql"
import saleCheckInsertItem from "./sql/salecheckInsertItem.sql"

export interface SaleCheckItem {
  productId: int;
  quantity: long;
  price: long;
  unitId: int;
  currencyId: int;
  createdAt: datetime;
}

export interface SaleCheckState {
  items: Array[SaleCheckItem];
  itemsCost: number;
  currentItem: SaleCheckItem;
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

function addSaleCheckItem(barcode) {
  return function (dispatch, getState, { db }) {
    if (barcode.length > 0) {
      db.selectOne("select * from product where barcode = ?", [ barcode ])
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
      .catch(err => {
        console.log(err);
        return db.exec("rollback");
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
}

const emptySaleCheckItem = {
  productId: -1,
  quantity: 0,
  price: 0,
  unitId: -1,
  currencyId: -1,
  createdAt: null,
};

function SaleCheckReducer (state: SaleCheckState = {
  items: [],
  itemsCost: 0.00,
  currentSaleCheckItem: emptySaleCheckItem,
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
        price: Math.round((Math.random() * 1000 + Number.EPSILON) * 100) / 100,
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
      return Object.assign({}, state, {
        currentSaleCheckItem: saleCheckItem,
        items: newItems,
        itemsCost: Math.round((sum + Number.EPSILON) * 100) / 100,
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
