import { createStore, combineReducers, applyMiddleware } from "redux"
import { AppReducer } from "../serv/app"
import { CounterReducer } from "../serv/counter"

function createRootReducer() {
  return combineReducers({
    app: AppReducer,
    counter: CounterReducer
  });
}

function promiseMiddleware(store) {
	return (next) => (action) => {
		const { promise, types, ...rest } = action  // eslint-disable-line
		if (!promise) {
			return next(action)
		}
		const [REQUEST, SUCCESS, FAILURE] = types
		next({...rest, type: REQUEST})
		return promise(store).then(
			(result) => {
				if (result.hasOwnProperty("status")) {
          if (result.status === 0) {
            if (result.hasOwnProperty("data")) {
              next({...rest, data: result.data, type: SUCCESS})
            } else {
              next({...rest, data: result, type: SUCCESS})
            }
          } else {
            next({...rest, data: result, type: FAILURE})
          }
				} else {
					next({...rest, data: result, type: SUCCESS})
        }
			},
			(error) => {
				const err = { code: -1, msg: error.message, data: [] }
				next({...rest, data: err, type: FAILURE})
			}
		)
	}
}

const store = applyMiddleware(promiseMiddleware)(createStore)(createRootReducer());

export default store;
