import { createStore, combineReducers, applyMiddleware } from "redux"
import { AppReducer } from "../serv/app"
import { CounterActions, CounterReducer } from "../serv/counter"
import { ProductActions, ProductReducer } from "../serv/product"
import migrate from "db/migration";

class DbService {

  exec(sql, params) {
    return new Promise((resolve, reject) => {
      db.exec(sql, params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve("OK");
        }
      })
    });
  }

  query(sql, params, extra) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve({ rows: rows, ...extra });
        }
      })
    });
  }
}


let sqlite3 = require("sqlite3").verbose();
let db = (process.env.NODE_ENV === "development") ?
  new sqlite3.Database("socmag.dev.db") :
    new sqlite3.Database("socmag.db");
let dbService = new DbService(db);

function createRootReducer() {
  return combineReducers({
    app: AppReducer,
    counter: CounterReducer,
    productList: ProductReducer,
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
		return promise(store, dbService).then(
			(result) => {
				if (result && result.hasOwnProperty("status")) {
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

function devCreateStore() {
  const { logger } = require("redux-logger");
  const middleware = [promiseMiddleware];
  const enhancers = [];
  middleware.push(logger);
  const actionCreators = {
    ...CounterActions,
    ...ProductActions,
  };
  const composeEnhancers = 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionCreators }): compose;
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);
  return createStore(createRootReducer(), undefined, enhancer);
}

function prodCreateStore() {
  const middleware = [promiseMiddleware];
  return applyMiddleware(...middleware)(createStore)(createRootReducer());
}

const store = (process.env.NODE_ENV === "development") ? devCreateStore() : prodCreateStore();
migrate(db).catch(err => console.log(err));
export default store;
