import { createStore, combineReducers, applyMiddleware } from "redux"
import { AppReducer } from "../serv/app"
import { CounterReducer } from "../serv/counter"
import { ProductReducer } from "../serv/product"
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

  query(sql, params) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    });
  }
}


let sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("socmag.db");
let dbService = new DbService(db);

function createRootReducer() {
  return combineReducers({
    app: AppReducer,
    counter: CounterReducer,
    product: ProductReducer,
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

const middleware = [promiseMiddleware];

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middleware.push(logger);
}

const store = applyMiddleware(...middleware)(createStore)(createRootReducer());

migrate(db).catch(err => console.log(err));

export default store;
