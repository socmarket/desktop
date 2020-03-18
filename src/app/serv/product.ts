export interface ProductRefState {
  items: Array,
  filterPattern: string,
  showForm: boolean
}

const productListUpdated = (pattern, rows) => ({
  type: "PRODUCT_GET_LIST",
  rows: rows,
  pattern: pattern
});


const ProductActions = {
  showProductForm: () => ({
    type: 'PRODUCT_SHOW_FORM'
  }),
  hideProductForm: () => ({
    type: 'PRODUCT_HIDE_FORM'
  }),

  setProductListFilter: (pattern) => {
    return function (dispatch, getState, { db }) {
      db.select("select * from product where (title like ?) or (code like ?) or (barcode like ?)",
        [
          "%" + pattern + "%",
          "%" + pattern + "%",
          "%" + pattern + "%",
        ], {
          pattern: pattern
        }
      ).then(rows => dispatch(productListUpdated(pattern, rows)))
    };
  },
}

function ProductReducer (state = {
  items: [],
  filterPattern: "",
  showForm: false
}, action) {
  switch (action.type) {
    case 'PRODUCT_GET_LIST':
      console.log(action);
      return Object.assign({}, state, { items: action.rows, filterPattern: action.pattern });
    case 'PRODUCT_SHOW_FORM':
      return Object.assign({}, state, { showForm: true });
    case 'PRODUCT_HIDE_FORM':
      return Object.assign({}, state, { showForm: false });
    default:
      return state
  }
}

export { ProductActions, ProductReducer };

