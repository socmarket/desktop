export interface AppState {

  showProductsDialog: boolean

}

const AppActions = {

  openProducts: () => ({
    type: 'APP_SHOW_PRODUCTS_DIALOG',
    payload: {}
  }),

  closeProducts: () => ({
    type: 'APP_HIDE_PRODUCTS_DIALOG',
    payload: {}
  }),

  openWarehouse: () => ({
    type: 'APP_SHOW_WAREHOUSE_DIALOG',
    payload: {}
  }),

  closeWarehouse: () => ({
    type: 'APP_HIDE_WAREHOUSE_DIALOG',
    payload: {}
  }),

}

function AppReducer (state: AppState = {
  showProductsDialog: false
}, action) {
  switch (action.type) {
    case 'APP_SHOW_PRODUCTS_DIALOG':
      return Object.assign({}, state, { showProductsDialog: true });
    case 'APP_HIDE_PRODUCTS_DIALOG':
      return Object.assign({}, state, { showProductsDialog: false });
    default:
      return state
  }
}

export { AppActions, AppReducer };

