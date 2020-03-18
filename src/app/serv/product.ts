export interface Product {
  id: int;
  barcode: string;
  code: string;
  title: string;
  notes: string;
  unitId: int;
}

export interface ProductState {
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
  type: "PRODUCT_FORM_UPDATED",
  product: product
});

function setProductListFilter(pattern) {
  return (dispatch, getState, { db }) => {
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
}

function changeCurrentProduct(product) {
  return function (dispatch, getState, { db }) {
    const { productList: { currentProduct } } = getState();
    if (product.barcode.length > 0) {
      db.selectOne("select * from product where barcode = ?", [ product.barcode ])
        .then(foundProduct => {
          if (foundProduct) {
            dispatch(currentProductUpdated(foundProduct));
          } else {
            dispatch(currentProductUpdated(Object.assign({}, product, { id: -1 })));
          }
        })
    } else {
      dispatch(currentProductUpdated(Object.assign({}, product, { id: -1 })));
    }
  };
}

function createProduct(product: Product) {
  return function (dispatch, getState, { db }) {
    const { productList: { filterPattern } } = getState();
    db.exec("insert into product(barcode, title, notes, unitId) values(?, ?, ?, ?)",
      [
        product.barcode,
        product.title,
        product.notes,
        product.unitId
      ], {
        product: product
      }
    )
      .then(_ => setProductListFilter(filterPattern)(dispatch, getState, { db }))
      .then(_ => changeCurrentProduct({
        id: -1,
        title: "",
        barcode: "",
        code: "",
        notes: "",
        unitId: 1,
      })(dispatch, getState, { db }))
  };
}

function updateProduct(product) {
  return function (dispatch, getState, { db }) {
    const { productList: { filterPattern } } = getState();
    db.exec("update product set barcode = $barcode, title = $title, notes = $notes, unitId = $unitId where id = $id",
      {
        $barcode: product.barcode,
        $title: product.title,
        $notes: product.notes,
        $unitId: product.unitId,
        $id: product.id
      }, {
        product: product
      }
    ).then(_ => setProductListFilter(filterPattern)(dispatch, getState, { db }))
  };
}

const ProductActions = {
  showProductForm: () => ({
    type: 'PRODUCT_SHOW_FORM'
  }),
  hideProductForm: () => ({
    type: 'PRODUCT_HIDE_FORM'
  }),
  createProduct: createProduct,
  updateProduct: updateProduct,
  setProductListFilter: setProductListFilter,
  changeCurrentProduct: changeCurrentProduct,
}

function ProductReducer (state: ProductState = {
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
    case 'PRODUCT_FORM_UPDATED':
      return Object.assign({}, state, { currentProduct: action.product });
    case 'PRODUCT_LIST_UPDATED':
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

