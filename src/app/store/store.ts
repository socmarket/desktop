import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk";
import { AppReducer } from "../serv/app"
import { UnitActions, UnitReducer } from "../serv/unit"
import { CounterActions, CounterReducer } from "../serv/counter"
import { ProductActions, ProductReducer } from "../serv/product"
import { SaleCheckActions, SaleCheckReducer } from "../serv/salecheck"
import { ConsignmentActions, ConsignmentReducer } from "../serv/consignment"
import migrate from "db/migration";

class DbService {

  exec(sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve("OK");
        }
      })
    });
  }

  select(sql, params) {
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

  selectOne(sql, params) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, function (err, rows) {
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
let db = (process.env.NODE_ENV === "development") ?
  new sqlite3.Database("socmag.dev.db") :
    new sqlite3.Database("socmag.db");
let dbService = new DbService(db);

const thunkM = thunk.withExtraArgument({
  db: dbService
});

function createRootReducer() {
  return combineReducers({
    app: AppReducer,
    unitList: UnitReducer,
    counter: CounterReducer,
    productList: ProductReducer,
    saleCheck: SaleCheckReducer,
    consignment: ConsignmentReducer,
  });
}

function devCreateStore() {
  const { logger } = require("redux-logger");
  const middleware = [thunkM];
  const enhancers = [];
  middleware.push(logger);
  const actionCreators = {
    ...UnitActions,
    ...CounterActions,
    ...ProductActions,
    ...SaleCheckActions,
    ...ConsignmentActions,
  };
  const composeEnhancers = 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionCreators }): compose;
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);
  return createStore(createRootReducer(), undefined, enhancer);
}

function prodCreateStore() {
  const middleware = [thunkM];
  return applyMiddleware(...middleware)(createStore)(createRootReducer());
}

const store = (process.env.NODE_ENV === "development") ? devCreateStore() : prodCreateStore();

migrate(db)
  .then(res => {
    store.dispatch(UnitActions.loadUnitList());
    Promise.resolve("OK");
  })
  .catch(err => console.log(err));

export default store;
