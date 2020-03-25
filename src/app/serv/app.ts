export interface AppState {
  showUnitsDialog: boolean;
  showPriceDialog: boolean;
  showProductsDialog: boolean;
  showCategoriesDialog: boolean;
  showSaleCheck: boolean;
  showConsignment: boolean;
}

const AppActions = {

  openDashboard: () => ({
    type: 'APP_OPEN_DASHBOARD',
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
  showSaleCheck: false,
  showConsignment: false,
  showDashboard: true,
}, action) {
  switch (action.type) {
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
    case 'APP_OPEN_DASHBOARD':
      return Object.assign({}, state, {
        showDashboard: true,
        showSaleCheck: false,
        showConsignment: false,
      });
    case 'APP_OPEN_CONSIGNMENT':
      return Object.assign({}, state, {
        showDashboard: false,
        showSaleCheck: false,
        showConsignment: true,
      });
    case 'APP_OPEN_SALECHECK':
      return Object.assign({}, state, {
        showDashboard: false,
        showSaleCheck: true,
        showConsignment: false,
      });
    default:
      return state
  }
}

export { AppActions, AppReducer };

