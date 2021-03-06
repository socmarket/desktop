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

const loadBg = () => (dispatch, getState) => {
  const { settings: { appMode } } = getState()
  switch (appMode) {
    case "base"       : return import("Style/base.css");
    case "auto/parts" : return import("Style/auto.css");
  }
}


const AppActions = {
  reloadBg: loadBg,
  openProductEditor: () => ({
    type: "APP_OPEN_PRODUCT_EDITOR",
  }),
  openInventory: () => ({
    type: "APP_OPEN_INVENTORY",
  }),
  openSaleCheckEditor: () => ({
    type: "APP_OPEN_SALE_CHECK_EDITOR",
  }),
  openSaleJournal: () => ({
    type: "APP_OPEN_SALE_CHECK_JOURNAL",
  }),
  openConsignmentEditor: () => ({
    type: "APP_OPEN_CONSIGNMENT_EDITOR",
  }),
  openConsignmentJournal: () => ({
    type: "APP_OPEN_CONSIGNMENT_JOURNAL",
  }),
  openProductImporter: () => ({
    type: "APP_OPEN_PRODUCT_IMPORTER",
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
  openTurnover: () => ({
    type: "APP_OPEN_BASE_TURNOVER",
  }),
  openSettingsEditor: () => ({
    type: "APP_OPEN_BASE_SETTINGS_EDITOR",
  }),
  openAuthSettings: () => ({
    type: "APP_OPEN_BASE_AUTH_SETTINGS",
  }),
  openAdminService: () => ({
    type: "APP_OPEN_BASE_ADMIN_SERVICE",
  }),
  changeUser: (user) => ({
    type: "APP_CHANGE_USER",
    user: user,
  }),
  signOut: () => ({
    type: "APP_SIGN_OUT",
  }),
  goIdle: () => ({
    type: "APP_WENT_IDLE",
  }),
  goWork: () => ({
    type: "APP_WENT_WORK",
  }),
  auth: auth,
}

function AppReducer (state = {
  activePage    : "saleCheckEditor",
  user          : "admin",
  unlocked      : false,
  authenticated : false,
  lastError     : "",
  online        : false,
  idle          : false,
}, action) {
  switch (action.type) {
    case "APP_OPEN_PRODUCT_EDITOR":
      return Object.assign({}, state, { activePage: "productEditor" })
    case "APP_OPEN_INVENTORY":
      return Object.assign({}, state, { activePage: "inventory" })
    case "APP_OPEN_PRODUCT_IMPORTER":
      return Object.assign({}, state, { activePage: "productImporter" })
    case "APP_OPEN_SALE_CHECK_EDITOR":
      return Object.assign({}, state, { activePage: "saleCheckEditor" })
    case "APP_OPEN_SALE_CHECK_JOURNAL":
      return Object.assign({}, state, { activePage: "saleCheckJournal" })
    case "APP_OPEN_CONSIGNMENT_EDITOR":
      return Object.assign({}, state, { activePage: "consignmentEditor" })
    case "APP_OPEN_CONSIGNMENT_JOURNAL":
      return Object.assign({}, state, { activePage: "consignmentJournal" })
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
    case "APP_OPEN_BASE_TURNOVER":
      return Object.assign({}, state, { activePage: "baseTurnover" })
    case "APP_OPEN_BASE_SETTINGS_EDITOR":
      return Object.assign({}, state, { activePage: "baseSettingsEditor" })
    case "APP_OPEN_BASE_AUTH_SETTINGS":
      return Object.assign({}, state, { activePage: "baseAuthSettings" })
    case "APP_OPEN_BASE_ADMIN_SERVICE":
      return Object.assign({}, state, { activePage: "baseAdminService" })
    case "APP_CHANGE_USER":
      return Object.assign({}, state, { user: action.user })
    case "APP_AUTH_OK":
      return Object.assign({}, state, {
        unlocked: true,
        activePage   : "saleCheckEditor",
      })
    case "APP_AUTH_FAIL":
      return Object.assign({}, state, { unlocked: false })
    case "APP_SIGN_OUT":
      return Object.assign({}, state, { unlocked: false })

    case "APP_WENT_IDLE":
      return Object.assign({}, state, { idle: true })
    case "APP_WENT_WORK":
      return Object.assign({}, state, { idle: false })

    case "SERVER_HEALTH_OK": {
      if (state.online) {
        return state
      } else {
        return Object.assign({}, state, { online: true })
      }
    }
    case "SERVER_HEALTH_NOT_OK": {
      if (state.online) {
        return Object.assign({}, state, { online: false })
      } else {
        return state
      }
    }

    default:
      return state
  }
}

export { AppActions, AppReducer }
