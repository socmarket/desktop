import { Product } from "./product"
import selectPriceForProduct        from "./sql/selectPriceForProduct.sql"
import selectConsignmentByProductId from "./sql/price/selectConsignmentByProductId.sql"

export interface PriceState {
  currentProduct: Price;
  currentProductPriceList: Array;
  consignmentSummary: object;
}

const priceListProductFound = (product, prices) => ({
  type: "PRICELIST_PRODUCT_FOUND",
  product: product,
  prices: prices,
});

const priceListProductNotFound = () => ({
  type: "PRICELIST_PRODUCT_NOT_FOUND",
});

const consignmentSummaryUpdated = (consignmentSummary) => ({
  type: "PRICELIST_CONSIGNMENT_SUMMARY_UPDATED",
  consignmentSummary: consignmentSummary,
})

function findProduct(barcode) {
  return function (dispatch, getState, { db }) {
    if (barcode.length > 0) {
      db.selectOne("select * from product where barcode = ?", [ barcode ])
        .then(foundProduct => {
          if (foundProduct) {
            db.select(selectPriceForProduct, [ foundProduct.id ])
              .then(prices => {
                const foundPrices = prices ? prices : [];
                dispatch(priceListProductFound(foundProduct, foundPrices));
              })
            ;
            db.select(selectConsignmentByProductId, { $productId: foundProduct.id })
              .then(rows => {
                const totalCost = rows.map(i => i.price * i.quantity).reduce((a, b) => a + b);
                const totalQuantity = rows.map(i => i.quantity).reduce((a, b) => a + b);
                dispatch(consignmentSummaryUpdated({
                  averagePrice: Math.round(totalCost / totalQuantity * 100) / 100.00,
                  totalCost: totalCost,
                  totalQuantity: totalQuantity,
                  items: rows,
                }));
              })
            ;
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
  },
  consignmentSummary: {
    totalCost: 0.00,
    totalQuantity: 0.00,
    averagePrice: 0.00,
    items: [],
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
    case 'PRICELIST_CONSIGNMENT_SUMMARY_UPDATED':
      return Object.assign({}, state, {
        consignmentSummary: action.consignmentSummary
      });
    default:
      return state
  }
}

export { PriceActions, PriceReducer };
