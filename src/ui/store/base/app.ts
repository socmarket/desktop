import sha256 from 'crypto-js/sha256';

function auth(pin) {
  return function (dispatch, getState, { api }) {
    const { app: { user }, settings: { cashierPinHash, managerPinHash, adminPinHash } } = getState()
    const hash = sha256(pin) + ""
    switch (user) {
      case "cashier":
        if (hash === cashierPinHash)
          return dispatch({
            type: "APP_AUTH_OK",
          })
        break
      case "manager":
        if (hash === managerPinHash)
          return dispatch({
            type: "APP_AUTH_OK",
          })
        break
      case "admin":
        if (hash === adminPinHash)
          return dispatch({
            type: "APP_AUTH_OK",
          })
        break
    }
    return dispatch({
      type: "APP_AUTH_FAIL",
    })
  }
}

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
  openAutoPartsProductImporter: () => ({
    type: "APP_OPEN_AUTO_PARTS_PRODUCT_IMPORTER",
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
  openPriceEditor: () => ({
    type: "APP_OPEN_BASE_PRICE_EDITOR",
  }),
  openDashboard: () => ({
    type: "APP_OPEN_BASE_DASHBOARD",
  }),
  openSettingsEditor: () => ({
    type: "APP_OPEN_BASE_SETTINGS_EDITOR",
  }),
  changeUser: (user) => ({
    type: "APP_CHANGE_USER",
    user: user,
  }),
  signOut: () => ({
    type: "APP_SIGN_OUT",
  }),
  auth: auth,
}

function AppReducer (state = {
  activePage    : "autoPartsSaleCheckEditor",
  user          : "admin",
  authenticated : false,
  lastError     : "",
}, action) {
  switch (action.type) {
    case "APP_OPEN_AUTO_PARTS_PRODUCT_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsProductEditor" })
    case "APP_OPEN_AUTO_PARTS_PRODUCT_IMPORTER":
      return Object.assign({}, state, { activePage: "autoPartsProductImporter" })
    case "APP_OPEN_AUTO_PARTS_SALE_CHECK_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsSaleCheckEditor" })
    case "APP_OPEN_AUTO_PARTS_SALE_JOURNAL":
      return Object.assign({}, state, { activePage: "autoPartsSaleJournal" })
    case "APP_OPEN_AUTO_PARTS_CONSIGNMENT_EDITOR":
      return Object.assign({}, state, { activePage: "autoPartsConsignmentEditor" })
    case "APP_OPEN_AUTO_PARTS_CONSIGNMENT_JOURNAL":
      return Object.assign({}, state, { activePage: "autoPartsConsignmentJournal" })
    case "APP_OPEN_BASE_CLIENT_EDITOR":
      return Object.assign({}, state, { activePage: "baseClientEditor" })
    case "APP_OPEN_BASE_SUPPLIER_EDITOR":
      return Object.assign({}, state, { activePage: "baseSupplierEditor" })
    case "APP_OPEN_BASE_CURRENCY_EDITOR":
      return Object.assign({}, state, { activePage: "baseCurrencyEditor" })
    case "APP_OPEN_BASE_CATEGORY_EDITOR":
      return Object.assign({}, state, { activePage: "baseCategoryEditor" })
    case "APP_OPEN_BASE_UNIT_EDITOR":
      return Object.assign({}, state, { activePage: "baseUnitEditor" })
    case "APP_OPEN_BASE_PRICE_EDITOR":
      return Object.assign({}, state, { activePage: "basePriceEditor" })
    case "APP_OPEN_BASE_DASHBOARD":
      return Object.assign({}, state, { activePage: "baseDashboard" })
    case "APP_OPEN_BASE_SETTINGS_EDITOR":
      return Object.assign({}, state, { activePage: "baseSettingsEditor" })
    case "APP_CHANGE_USER":
      return Object.assign({}, state, { user: action.user })
    case "APP_AUTH_OK":
      return Object.assign({}, state, { authenticated: true })
    case "APP_AUTH_FAIL":
      return Object.assign({}, state, { authenticated: false })
    case "APP_SIGN_OUT":
      return Object.assign({}, state, { authenticated: false })
    default:
      return state
  }
}

export { AppActions, AppReducer }
