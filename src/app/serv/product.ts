export interface ProductRefState {
  items: Array,
  filterPattern: string,
  showForm: boolean
}

const ProductActions = {
  showProductForm: () => ({
    type: 'PRODUCT_SHOW_FORM'
  }),
  hideProductForm: () => ({
    type: 'PRODUCT_HIDE_FORM'
  }),
  setProductListFilter: (pattern) => {
    return {
      types: [
        "PRODUCT_BEFORE_GET_LIST",
        "PRODUCT_GET_LIST",
        "PRODUCT_GET_LIST_FAILED",
      ]
      , promise: (store, db) => (
        db.query("select * from product where (title like ?) or (code like ?) or (barcode like ?)",
          [
            "%" + pattern + "%",
            "%" + pattern + "%",
            "%" + pattern + "%",
          ], {
            pattern: pattern
          }
        )
      )
    }
  },
}

function ProductReducer (state = {
  items: [],
  filterPattern: "",
  showForm: false
}, action) {
  switch (action.type) {
    case 'PRODUCT_GET_LIST':
      return Object.assign({}, state, { items: action.data.rows, filterPattern: action.data.pattern });
    case 'PRODUCT_SHOW_FORM':
      return Object.assign({}, state, { showForm: true });
    case 'PRODUCT_HIDE_FORM':
      return Object.assign({}, state, { showForm: false });
    default:
      return state
  }
}

export { ProductActions, ProductReducer };

