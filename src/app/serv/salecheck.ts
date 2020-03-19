import Product from "./product.ts"
import salecheckFindProduct from "./sql/salecheckFindProduct.sql"

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
  currentProduct: Product;
}

const currentSaleCheckProductFound = (product) => ({
  type: "SALECHECK_PRODUCT_FOUND",
  product: product,
});

const currentSaleCheckProductNotFound = () => ({
  type: "SALECHECK_PRODUCT_NOT_FOUND",
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

const SaleCheckActions = {
  addSaleCheckItem: addSaleCheckItem,
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
  currentProduct: {
    id: -1,
    code: "",
    barcode: "",
    title: "",
    notes: "",
    unitId: -1,
  }
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
    default:
      return state
  }
}

export { SaleCheckActions, SaleCheckReducer };
