const productListFiltered = (pattern, items) => ({
  type: "AUTO_PRODUCT_LIST_FILTERED",
  items: items,
  pattern: pattern,
})

function filterProductList(pattern) {
  return (dispatch, getState, { api }) => {
    return api.autoParts.product.find(pattern)
      .then(items => dispatch(productListFiltered(pattern, items)))
  }
}

const AutoPartsProductActions = {
  filterProductList: filterProductList,
}

function AutoPartsProductReducer (state = {
  productList: {
    items: [],
    pattern: "",
  }
}, action) {
  switch (action.type) {
    case 'AUTO_PRODUCT_LIST_FILTERED':
      return Object.assign({}, state, {
        productList: {
          items: action.items,
          pattern: action.pattern,
        }
      })
    default:
      return state
  }
}

export { AutoPartsProductActions, AutoPartsProductReducer }
