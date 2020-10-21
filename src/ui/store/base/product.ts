const productListFiltered = (pattern, items) => ({
  type: "PRODUCT_LIST_FILTERED",
  items: items,
  pattern: pattern,
})

function filterProductList(pattern, limit, offset) {
  return (dispatch, getState, { api }) => {
    const { settings: { appMode } } = getState()
    switch (appMode) {
      case "base":
        return api.product.find(pattern, limit, offset)
          .then(items => dispatch(productListFiltered(pattern, items)))
      case "auto/parts":
        return api.autoParts.product.find(pattern, limit, offset)
          .then(items => dispatch(productListFiltered(pattern, items)))
    }
  }
}

const ProductActions = {
  filterProductList: filterProductList,
}

function ProductReducer (state = {
  productList: {
    items: [],
    pattern: "",
    limit: 50,
    offset: 0,
  }
}, action) {
  switch (action.type) {
    case "PRODUCT_LIST_FILTERED":
      return Object.assign({}, state, {
        productList: {
          items: action.items,
          pattern: action.pattern,
          offset: action.offset,
          limit: action.limit,
        }
      })
    default:
      return state
  }
}

export { ProductActions, ProductReducer }
