const updateProfitByDay = (items) => ({
  type: "DASHBOARD_PROFIT_BY_DAY_UPDATED",
  items: items,
});

function reloadProfitByDay(start, end) {
  return function (dispatch, getState, { api }) {
    return api.dashboard.selectProfitByDay(start, end)
      .then(items => {
        if (items) {
          return dispatch(updateProfitByDay(items));
        } else {
          return dispatch(updateProfitByDay([]));
        }
      })
    ;
  };
}

const DashboardActions = {
  reloadProfitByDay: reloadProfitByDay,
};

function DashboardReducer (state = {
  profitByDay: {
    items: []
  }
}, action) {
  switch (action.type) {
    case "DASHBOARD_PROFIT_BY_DAY_UPDATED": {
      return Object.assign({}, state, {
        profitByDay: {
          items: action.items
        }
      });
    }
    default:
      return state;
  }
}

export { DashboardActions, DashboardReducer };
