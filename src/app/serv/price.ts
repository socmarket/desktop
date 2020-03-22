import { Product } from "./product"
import selectPriceForProduct from "./sql/selectPriceForProduct.sql"

export interface PriceState {
  currentProduct: Price,
  currentProductPriceList: Array
}

const priceListProductFound = (product, prices) => ({
  type: "PRICELIST_PRODUCT_FOUND",
  product: product,
  prices: prices,
});

const priceListProductNotFound = () => ({
  type: "PRICELIST_PRODUCT_NOT_FOUND",
});

function findProduct(barcode) {
  return function (dispatch, getState, { db }) {
    if (barcode.length > 0) {
      db.selectOne("select * from product where barcode = ?", [ barcode ])
        .then(foundProduct => {
          if (foundProduct) {
            return db.select(selectPriceForProduct, [ foundProduct.id ])
              .then(prices => {
                const foundPrices = prices ? prices : [];
                dispatch(priceListProductFound(foundProduct, foundPrices));
              })
          } else {
            dispatch(priceListProductNotFound());
          }
        })
    } else {
      dispatch(priceListProductNotFound());
    }
  };
}

function setPrice(price, currencyId) {
  return function (dispatch, getState, { db }) {
    const { priceList: { currentProduct } } = getState();
    if (currentProduct.id > 0) {
      console.log(Math.round(price * 100 + Number.EPSILON));
      return db.exec("insert into price(productId, price) values(?, ?)", [
        currentProduct.id,
        Math.round(price * 100 + Number.EPSILON)
      ]).then(_ => {
        return db.select(selectPriceForProduct, [ currentProduct.id ])
          .then(prices => {
            const foundPrices = prices ? prices : [];
            dispatch(priceListProductFound(currentProduct, foundPrices));
          })
      });
    };
  };
}

const PriceActions = {
  findProduct: findProduct,
  setPrice: setPrice,
}

function PriceReducer (state: PriceState = {
  currentProductPriceList: [],
  currentProduct: {
    id: -1,
    code: "",
    barcode: "",
    title: "",
    notes: "",
  }
}, action) {
  switch (action.type) {
    case 'PRICELIST_PRODUCT_FOUND':
      return Object.assign({}, state, {
        currentProduct: action.product,
        currentProductPriceList: action.prices
      });
    case 'PRICELIST_PRODUCT_NOT_FOUND':
      return Object.assign({}, state, {
        currentProduct: {
          id: -1,
          code: "",
          barcode: "",
          title: "",
          notes: "",
        },
        currentProductPriceList: []
      });
    default:
      return state
  }
}

export { PriceActions, PriceReducer };
