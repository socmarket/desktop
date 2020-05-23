export interface AppState {
  showUnitsDialog: boolean;
  showPriceDialog: boolean;
  showProductsDialog: boolean;
  showCategoriesDialog: boolean;
  showSuppliersDialog: boolean;
  showClientsDialog: boolean;
  showSaleCheck: boolean;
  showConsignment: boolean;
  showSettings: boolean;
}

const AppActions = {

  openDashboard: () => ({
    type: 'APP_OPEN_DASHBOARD',
  }),

  openSaleJournal: () => ({
    type: 'APP_OPEN_SALE_JOURNAL',
  }),

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

  openWarehouse: () => ({
    type: 'APP_SHOW_WAREHOUSE_DIALOG',
  }),

  closeWarehouse: () => ({
    type: 'APP_HIDE_WAREHOUSE_DIALOG',
  }),

  openConsignment: () => ({
    type: 'APP_OPEN_CONSIGNMENT',
  }),

  openSaleCheck: () => ({
    type: 'APP_OPEN_SALECHECK',
  }),

}

function AppReducer (state: AppState = {
  showPriceDialog: false,
  showProductsDialog: false,
  showCategoriesDialog: false,
  showSuppliersDialog: false,
  showClientsDialog: false,
  showSaleCheck: false,
  showConsignment: false,
  showDashboard: true,
  showSaleJournal: false,
  showSettingsDialog: true,
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
    case 'APP_OPEN_DASHBOARD':
      return Object.assign({}, state, {
        showDashboard: true,
        showSaleJournal: false,
        showSaleCheck: false,
        showConsignment: false,
      });
    case 'APP_OPEN_SALE_JOURNAL':
      return Object.assign({}, state, {
        showDashboard: false,
        showSaleJournal: true,
        showSaleCheck: false,
        showConsignment: false,
      });
    case 'APP_OPEN_CONSIGNMENT':
      return Object.assign({}, state, {
        showDashboard: false,
        showSaleJournal: false,
        showSaleCheck: false,
        showConsignment: true,
      });
    case 'APP_OPEN_SALECHECK':
      return Object.assign({}, state, {
        showDashboard: false,
        showSaleJournal: false,
        showSaleCheck: true,
        showConsignment: false,
      });
    default:
      return state
  }
}

export { AppActions, AppReducer };
