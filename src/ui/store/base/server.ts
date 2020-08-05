
function checkLink() {
  return (dispatch, getState, { api }) => {
    return api.autoParts.product.find(pattern, limit, offset)
      .then(items => dispatch(productListFiltered(pattern, items)))
  }
}

const evLinkUp = () => ({
  type: "SERVER_LINK_UP",
})

const evLinkDown = () => ({
  type: "SERVER_LINK_DOWN",
})

const ServerActions = {
  checkLink: checkLink,
}

function ServerReducer (state = {
  connected : false,
}, action) {
  switch (action.type) {
    case "SERVER_LINK_UP":
      return Object.assign({}, state, { connected: "true" })
    default:
      return state
  }
}

export { ServerActions, ServerReducer }
