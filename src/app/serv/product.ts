export interface Product {
  id: int;
  barcode: string;
  code: string;
  title: string;
  notes: string;
}

export interface ProductRefState {
  items: Array,
  filterPattern: string,
  showForm: boolean,
  currentProduct: Product
}

const productListUpdated = (pattern, rows) => ({
  type: "PRODUCT_LIST_UPDATED",
  rows: rows,
  pattern: pattern
});

const currentProductUpdated = (product) => ({
  type: "PRODUCT_UPDATED",
  product: product
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

  changeCurrentProduct: (product) => {
    return function (dispatch, getState, { db }) {
      const { productList: { currentProduct } } = getState();
      if (currentProduct.barcode !== product.barcode) {
        db.selectOne("select * from product where barcode = ?", [ product.barcode ])
          .then(row => {
            if (row) {
              dispatch(currentProductUpdated(row));
            } else {
              dispatch(currentProductUpdated(Object.assign({}, product, { id: -1 })));
            }
          })
      } else {
        dispatch(currentProductUpdated(Object.assign({}, product, { id: currentProduct.id })));
      }
    };
  },
}

function ProductReducer (state = {
  items: [],
  filterPattern: "",
  showForm: false,
  currentProduct: {
    id: -1,
    code: "",
    barcode: "",
    title: "",
    notes: "",
  }
}, action) {
  switch (action.type) {
    case 'PRODUCT_UPDATED':
      console.log(action);
      return Object.assign({}, state, { currentProduct: action.product });
    case 'PRODUCT_LIST_UPDATED':
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

