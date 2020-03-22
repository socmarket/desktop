export interface AppState {
  showProductsDialog: boolean;
  showPriceDialog: boolean;
  showSaleCheck: boolean;
  showConsignment: boolean;
}

const AppActions = {

  openProducts: () => ({
    type: 'APP_SHOW_PRODUCTS_DIALOG',
  }),

  closeProducts: () => ({
    type: 'APP_HIDE_PRODUCTS_DIALOG',
  }),

  openPrices: () => ({
    type: 'APP_SHOW_PRICES_DIALOG',
  }),

  closePrices: () => ({
    type: 'APP_HIDE_PRICES_DIALOG',
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
  showPriceDialog: true,
  showProductsDialog: false,
  showSaleCheck: false,
  showConsignment: true,
}, action) {
  switch (action.type) {
    case 'APP_SHOW_PRODUCTS_DIALOG':
      return Object.assign({}, state, { showProductsDialog: true });
    case 'APP_HIDE_PRODUCTS_DIALOG':
      return Object.assign({}, state, { showProductsDialog: false });
    case 'APP_SHOW_PRICES_DIALOG':
      return Object.assign({}, state, { showPricesDialog: true });
    case 'APP_HIDE_PRICES_DIALOG':
      return Object.assign({}, state, { showPricesDialog: false });
    case 'APP_OPEN_CONSIGNMENT':
      return Object.assign({}, state, {
        showSaleCheck: false,
        showConsignment: true,
      });
    case 'APP_OPEN_SALECHECK':
      return Object.assign({}, state, {
        showSaleCheck: true,
        showConsignment: false,
      });
    default:
      return state
  }
}

export { AppActions, AppReducer };

