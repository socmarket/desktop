const AppActions = {
  openAutoPartsSaleCheckEditor: () => ({
    type: "APP_OPEN_AUTO_PARTS_SALE_CHECK_EDITOR",
  }),
  openAutoPartsSaleJournal: () => ({
    type: "APP_OPEN_AUTO_PARTS_SALE_JOURNAL",
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
    case "APP_OPEN_AUTO_PARTS_SALE_JOURNAL":
      return Object.assign({}, state, { activePage: "autoPartsSaleJournal" });
    default:
      return state
  }
}

export { AppActions, AppReducer }
