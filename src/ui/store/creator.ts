import { AppActions, AppReducer } from "./base/app"
import { SettingsActions, SettingsReducer } from "./base/settings"
import { ProductActions, ProductReducer } from "./base/product"

import {
  createStore as createReduxStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux"

import thunk from "redux-thunk"

function createRootReducer() {
  return combineReducers({
    app      : AppReducer,
    settings : SettingsReducer,
    product  : ProductReducer,
  })
}

function devCreateStore(thunkM) {
  const { logger } = require("redux-logger")
  const middleware = [thunkM]
  const enhancers = []
  middleware.push(logger)
  const actionCreators = {
    ...AppActions,
    ...SettingsActions,
    ...ProductActions,
  }
  const composeEnhancers = 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionCreators }): compose
  enhancers.push(applyMiddleware(...middleware))
  const enhancer = composeEnhancers(...enhancers)
  return createReduxStore(createRootReducer(), undefined, enhancer)
}

function prodCreateStore(thunkM) {
  const middleware = [thunkM]
  return applyMiddleware(...middleware)(createReduxStore)(createRootReducer())
}

async function createStore(interfaces, isDev = (process.env.NODE_ENV === "development")) {
  const thunkM = thunk.withExtraArgument(interfaces)
  const store = isDev ? devCreateStore(thunkM) : prodCreateStore(thunkM)
  await store.dispatch(SettingsActions.reloadSettings())
  return store
}

export { createStore }
