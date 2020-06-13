export interface AppState {
  showUnitsDialog: boolean;
  showPriceDialog: boolean;
  showProductsDialog: boolean;
  showCategoriesDialog: boolean;
  showSuppliersDialog: boolean;
  showClientsDialog: boolean;
  showSettingsDialog: boolean;
  showLabellerDialog: boolean;
  activePage: String;
}

const AppActions = {

  openProducts: () => ({
    type: 'APP_SHOW_PRODUCTS_DIALOG',
  }),

  closeProducts: () => ({
    type: 'APP_HIDE_PRODUCTS_DIALOG',
  }),

  openCategories: () => ({
    type: 'APP_SHOW_CATEGORIES_DIALOG',
  }),

  closeCategories: () => ({
    type: 'APP_HIDE_CATEGORIES_DIALOG',
  }),

  openSuppliers: () => ({
    type: 'APP_SHOW_SUPPLIERS_DIALOG',
  }),

  closeSuppliers: () => ({
    type: 'APP_HIDE_SUPPLIERS_DIALOG',
  }),

  openClients: () => ({
    type: 'APP_SHOW_CLIENTS_DIALOG',
  }),

  closeClients: () => ({
    type: 'APP_HIDE_CLIENTS_DIALOG',
  }),

  openPrices: () => ({
    type: 'APP_SHOW_PRICES_DIALOG',
  }),

  closePrices: () => ({
    type: 'APP_HIDE_PRICES_DIALOG',
  }),

  openUnits: () => ({
    type: 'APP_SHOW_UNITS_DIALOG',
  }),

  closeUnits: () => ({
    type: 'APP_HIDE_UNITS_DIALOG',
  }),

  openSettings: () => ({
    type: 'APP_SHOW_SETTINGS_DIALOG',
  }),

  closeSettings: () => ({
    type: 'APP_HIDE_SETTINGS_DIALOG',
  }),

  openLabeller: () => ({
    type: 'APP_SHOW_LABELLER_DIALOG',
  }),

  closeLabeller: () => ({
    type: 'APP_HIDE_LABELLER_DIALOG',
  }),

  openConsignment: () => ({
    type: 'APP_OPEN_CONSIGNMENT',
  }),

  openSaleCheck: () => ({
    type: 'APP_OPEN_SALECHECK',
  }),

  openDashboard: () => ({
    type: 'APP_OPEN_DASHBOARD',
  }),

}

function AppReducer (state: AppState = {
  showPriceDialog: false,
  showProductsDialog: false,
  showCategoriesDialog: false,
  showSuppliersDialog: false,
  showClientsDialog: false,
  showSettingsDialog: false,
  showLabellerDialog: false,
  activePage: "dashboard",
}, action) {
  switch (action.type) {
    case 'APP_SHOW_CLIENTS_DIALOG':
      return Object.assign({}, state, { showClientsDialog: true });
    case 'APP_HIDE_CLIENTS_DIALOG':
      return Object.assign({}, state, { showClientsDialog: false });
    case 'APP_SHOW_SUPPLIERS_DIALOG':
      return Object.assign({}, state, { showSuppliersDialog: true });
    case 'APP_HIDE_SUPPLIERS_DIALOG':
      return Object.assign({}, state, { showSuppliersDialog: false });
    case 'APP_SHOW_CATEGORIES_DIALOG':
      return Object.assign({}, state, { showCategoriesDialog: true });
    case 'APP_HIDE_CATEGORIES_DIALOG':
      return Object.assign({}, state, { showCategoriesDialog: false });
    case 'APP_SHOW_PRODUCTS_DIALOG':
      return Object.assign({}, state, { showProductsDialog: true });
    case 'APP_HIDE_PRODUCTS_DIALOG':
      return Object.assign({}, state, { showProductsDialog: false });
    case 'APP_SHOW_PRICES_DIALOG':
      return Object.assign({}, state, { showPricesDialog: true });
    case 'APP_HIDE_PRICES_DIALOG':
      return Object.assign({}, state, { showPricesDialog: false });
    case 'APP_SHOW_UNITS_DIALOG':
      return Object.assign({}, state, { showUnitsDialog: true });
    case 'APP_HIDE_UNITS_DIALOG':
      return Object.assign({}, state, { showUnitsDialog: false });
    case 'APP_SHOW_SETTINGS_DIALOG':
      return Object.assign({}, state, { showSettingsDialog: true });
    case 'APP_HIDE_SETTINGS_DIALOG':
      return Object.assign({}, state, { showSettingsDialog: false });
    case 'APP_SHOW_LABELLER_DIALOG':
      return Object.assign({}, state, { showLabellerDialog: true });
    case 'APP_HIDE_LABELLER_DIALOG':
      return Object.assign({}, state, { showLabellerDialog: false });
    case 'APP_OPEN_DASHBOARD':
      return Object.assign({}, state, { activePage: "dashboard" });
    case 'APP_OPEN_CONSIGNMENT':
      return Object.assign({}, state, { activePage: "consignment" });
    case 'APP_OPEN_SALECHECK':
      return Object.assign({}, state, { activePage: "saleCheck" });
    default:
      return state
  }
}

export { AppActions, AppReducer };
