const AppActions = {
  openAutoPartsSaleCheckEditor: () => ({
    type: "APP_OPEN_AUTO_PARTS_SALE_CHECK_EDITOR",
  }),
  openAutoPartsSaleJournal: () => ({
    type: "APP_OPEN_AUTO_PARTS_SALE_JOURNAL",
  }),
  openAutoPartsConsignmentEditor: () => ({
    type: "APP_OPEN_AUTO_PARTS_CONSIGNMENT_EDITOR",
  }),
  openAutoPartsConsignmentJournal: () => ({
    type: "APP_OPEN_AUTO_PARTS_CONSIGNMENT_JOURNAL",
  }),
  openAutoPartsProductEditor: () => ({
    type: "APP_OPEN_AUTO_PARTS_PRODUCT_EDITOR",
  }),
  openClientEditor: () => ({
    type: "APP_OPEN_BASE_CLIENT_EDITOR",
  }),
  openSupplierEditor: () => ({
    type: "APP_OPEN_BASE_SUPPLIER_EDITOR",
  }),
  openCurrencyEditor: () => ({
    type: "APP_OPEN_BASE_CURRENCY_EDITOR",
  }),
  openCategoryEditor: () => ({
    type: "APP_OPEN_BASE_CATEGORY_EDITOR",
  }),
  openUnitEditor: () => ({
    type: "APP_OPEN_BASE_UNIT_EDITOR",
  }),
}

function AppReducer (state = {
  activePage: "baseCurrencyEditor"
}, action) {
  switch (action.type) {
    case "APP_OPEN_AUTO_PARTS_PRODUCT_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsProductEditor" });
    case "APP_OPEN_AUTO_PARTS_SALE_CHECK_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsSaleCheckEditor" });
    case "APP_OPEN_AUTO_PARTS_SALE_JOURNAL":
      return Object.assign({}, state, { activePage: "autoPartsSaleJournal" });
    case "APP_OPEN_AUTO_PARTS_CONSIGNMENT_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsConsignmentEditor" });
    case "APP_OPEN_AUTO_PARTS_CONSIGNMENT_JOURNAL":
      return Object.assign({}, state, { activePage: "autoPartsConsignmentJournal" });
    case "APP_OPEN_BASE_CLIENT_EDITOR":
      return Object.assign({}, state, { activePage: "baseClientEditor" });
    case "APP_OPEN_BASE_SUPPLIER_EDITOR":
      return Object.assign({}, state, { activePage: "baseSupplierEditor" });
    case "APP_OPEN_BASE_CURRENCY_EDITOR":
      return Object.assign({}, state, { activePage: "baseCurrencyEditor" });
    case "APP_OPEN_BASE_CATEGORY_EDITOR":
      return Object.assign({}, state, { activePage: "baseCategoryEditor" });
    case "APP_OPEN_BASE_UNIT_EDITOR":
      return Object.assign({}, state, { activePage: "baseUnitEditor" });
    default:
      return state
  }
}

export { AppActions, AppReducer }
