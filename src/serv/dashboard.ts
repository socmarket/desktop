const updateProfitByDay = (res) => ({
  type: "DASHBOARD_PROFIT_BY_DAY_UPDATED",
  res: res,
});

const updateProductPie = (res) => ({
  type: "DASHBOARD_PRODUCT_PIE_UPDATED",
  res: res,
});

const updateLowCountProducts = (res) => ({
  type: "DASHBOARD_LOW_COUNT_PRODUCTS_UPDATED",
  res: res,
});

function reloadProfitByDay(start, end) {
  return function (dispatch, getState, { api }) {
    const startS = start.utc().format("YYYY-MM-DD");
    const endS = end.utc().format("YYYY-MM-DD");
    return api.report.selectProfitByDay(startS, endS)
      .then(res => dispatch(updateProfitByDay(res)))
    ;
  };
}

function reloadProductPie() {
  return function (dispatch, getState, { api }) {
    return api.report.selectProductPie()
      .then(res => dispatch(updateProductPie(res)))
    ;
  };
}

function reloadLowCountProducts(start, end) {
  return function (dispatch, getState, { api }) {
    const startS = start.utc().format("YYYY-MM-DD");
    const endS = end.utc().format("YYYY-MM-DD");
    return api.report.selectLowCountProducts(startS, endS)
      .then(res => dispatch(updateLowCountProducts(res)))
    ;
  };
}

const DashboardActions = {
  reloadProductPie: reloadProductPie,
  reloadProfitByDay: reloadProfitByDay,
  reloadLowCountProducts: reloadLowCountProducts,
};

function DashboardReducer (state = {
  productPie: {
    items: []
  },
  profitByDay: {
    items: [],
    summary: {
      revenue: 0,
      cost: 0,
      credit: 0,
      profit: 0,
    }
  },
  lowCountProducts: {
    items: [],
  }
}, action) {
  switch (action.type) {
    case "DASHBOARD_PRODUCT_PIE_UPDATED": {
      return Object.assign({}, state, {
        productPie: action.res,
      });
    }
    case "DASHBOARD_PROFIT_BY_DAY_UPDATED": {
      return Object.assign({}, state, {
        profitByDay: action.res,
      });
    }
    case "DASHBOARD_LOW_COUNT_PRODUCTS_UPDATED": {
      return Object.assign({}, state, {
        lowCountProducts: action.res,
      });
    }
    default:
      return state;
  }
}

export { DashboardActions, DashboardReducer };
