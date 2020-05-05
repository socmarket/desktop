import totalSaleQuantityByProduct from "./sql/dashboardTotalSaleQuantityByProduct.sql"

export interface DashboardState {
  totalSaleQuantityByProduct: Array
}

const updateTotalSaleQuantityByProduct = (items) => ({
  type: "DASHBOARD_TOTAL_SALE_QUANTITY",
  items: items,
})

function reloadTotalSaleQuantityByProduct(barcode) {
  return function (dispatch, getState, { db }) {
    return db.select(totalSaleQuantityByProduct)
      .then(items => {
        if (items) {
          dispatch(updateTotalSaleQuantityByProduct(items));
        } else {
          dispatch(updateTotalSaleQuantityByProduct([]));
        }
      })
  };
}


const DashboardActions = {
  reloadTotalSaleQuantityByProduct: reloadTotalSaleQuantityByProduct,
};

function DashboardReducer (state = {
  totalSaleQuantityByProduct: []
}, action) {
  switch (action.type) {
    case "DASHBOARD_TOTAL_SALE_QUANTITY": {
      return Object.assign({}, state, {
        totalSaleQuantityByProduct: action.items
      });
    }
    default:
      return state;
  }
}

export { DashboardActions, DashboardReducer };
