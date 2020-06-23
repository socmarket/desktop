const AppActions = {
  openAutoPartsProductEditor: () => ({
    type: "APP_OPEN_AUTO_PARTS_PRODUCT_EDITOR",
  }),
}

function AppReducer (state = {
  activePage: "autoPartsProductEditor"
}, action) {
  switch (action.type) {
    case "APP_OPEN_AUTO_PARTS_PRODUCT_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsProductEditor" });
    default:
      return state
  }
}

export { AppActions, AppReducer }
