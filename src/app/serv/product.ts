export interface ProductRefState {
  products: Array
}

const ProductActions = {
  getList: (pattern) => {
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
          ]
        )
      )
    }
  },
}

function ProductReducer (state = { products: [] }, action) {
  switch (action.type) {
    case 'PRODUCT_GET_LIST':
      return Object.assign({}, state, { products: action.data });
    default:
      return state
  }
}

export { ProductActions, ProductReducer };

