const productListFiltered = (pattern, items) => ({
  type: "AUTO_PRODUCT_LIST_FILTERED",
  items: items,
  pattern: pattern,
})

function filterProductList(pattern, limit, offset) {
  return (dispatch, getState, { api }) => {
    return api.autoParts.product.find(pattern, limit, offset)
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
    limit: 50,
    offset: 0,
  }
}, action) {
  switch (action.type) {
    case 'AUTO_PRODUCT_LIST_FILTERED':
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

export { AutoPartsProductActions, AutoPartsProductReducer }
