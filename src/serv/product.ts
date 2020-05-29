import selectProductList from "./sql/product/selectProductList.sql"
import updateProductSql from "./sql/product/updateProduct.sql"

export interface Product {
  id: int;
  barcode: string;
  code: string;
  title: string;
  notes: string;
  unitId: int;
  categoryId: int;
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
    const key = pattern.toLowerCase().split(" ")
      .concat([ "", "", "" ])
      .map(k => {
        if (k.length > 0) {
          return "%" + k + "%";
        } else {
          return k;
        }
      })
    ;
    console.log(key);
    return db.select(
        selectProductList,
        {
          $pattern: pattern.toLowerCase(),
          $key0: key[0],
          $key1: key[1],
        }
      )
      .then(rows => dispatch(productListUpdated(pattern, rows)))
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
    db.exec(
        "insert into product(barcode, title, titleLower, notes, notesLower, unitId, categoryId) values(?, ?, ?, ?, ?, ?, ?)",
        [
          product.barcode,
          product.title,
          product.title.toLowerCase(),
          product.notes,
          product.notes.toLowerCase(),
          product.unitId,
          product.categoryId
        ]
      )
      .then(_ => setProductListFilter(filterPattern)(dispatch, getState, { db }))
      .then(_ => changeCurrentProduct({
        id: -1,
        title: "",
        barcode: "",
        code: "",
        notes: "",
        unitId: 1,
        categoryid: -1,
      })(dispatch, getState, { db }))
  };
}

function updateProduct(product) {
  return function (dispatch, getState, { db }) {
    const { productList: { filterPattern } } = getState();
    return db.exec(updateProductSql, {
      $barcode: product.barcode,
      $title: product.title,
      $title: product.title.toLowerCase(),
      $notes: product.notes,
      $notesLower: product.notes.toLowerCase(),
      $unitId: product.unitId,
      $categoryId: product.categoryId,
      $id: product.id
    }).then(_ => setProductListFilter(filterPattern)(dispatch, getState, { db }))
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
  showForm: true,
  currentProduct: {
    id: -1,
    code: "",
    barcode: "",
    title: "",
    notes: "",
    unitId: -1,
    categoryId: -1,
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

