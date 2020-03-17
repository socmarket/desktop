export interface ProductRefState {
  items: Array,
  filterPattern: string
}

const ProductActions = {
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

function ProductReducer (state = { items: [], filterPattern: "" }, action) {
  switch (action.type) {
    case 'PRODUCT_GET_LIST':
      return Object.assign({}, state, { items: action.data.rows, filterPattern: action.data.pattern });
    default:
      return state
  }
}

export { ProductActions, ProductReducer };

