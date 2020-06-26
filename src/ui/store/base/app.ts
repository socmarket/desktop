const AppActions = {
  openAutoPartsSaleCheck: () => ({
    type: "APP_OPEN_AUTO_PARTS_SALE_CHECK_EDITOR",
  }),
  openAutoPartsProductEditor: () => ({
    type: "APP_OPEN_AUTO_PARTS_PRODUCT_EDITOR",
  }),
}

function AppReducer (state = {
  activePage: "autoPartsSaleCheckEditor"
}, action) {
  switch (action.type) {
    case "APP_OPEN_AUTO_PARTS_PRODUCT_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsProductEditor" });
    case "APP_OPEN_AUTO_PARTS_SALE_CHECK_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsSaleCheckEditor" });
    default:
      return state
  }
}

export { AppActions, AppReducer }
