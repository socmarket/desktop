const updateProfitByDay = (res) => ({
  type: "DASHBOARD_PROFIT_BY_DAY_UPDATED",
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

const DashboardActions = {
  reloadProfitByDay: reloadProfitByDay,
};

function DashboardReducer (state = {
  profitByDay: {
    items: [],
    summary: {
      revenue: 0,
      cost: 0,
      credit: 0,
      profit: 0,
    }
  }
}, action) {
  switch (action.type) {
    case "DASHBOARD_PROFIT_BY_DAY_UPDATED": {
      return Object.assign({}, state, {
        profitByDay: action.res,
      });
    }
    default:
      return state;
  }
}

export { DashboardActions, DashboardReducer };
