import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk";
import { AppReducer } from "../serv/app"
import { UnitActions, UnitReducer } from "../serv/unit"
import { CounterActions, CounterReducer } from "../serv/counter"
import { PriceActions, PriceReducer } from "../serv/price"
import { DashboardActions, DashboardReducer } from "../serv/dashboard"
import { SaleJournalActions, SaleJournalReducer } from "../serv/salejournal"
import { RegistryActions, RegistryReducer } from "../serv/registry"
import { ProductActions, ProductReducer } from "../serv/product"
import { CategoryActions, CategoryReducer } from "../serv/category"
import { SaleCheckActions, SaleCheckReducer } from "../serv/salecheck"
import { ConsignmentActions, ConsignmentReducer } from "../serv/consignment"
import { SupplierActions, SupplierReducer } from "../serv/supplier"
import { ClientActions, ClientReducer } from "../serv/client"
import { AclActions, AclReducer } from "../serv/acl"
import { PrinterActions, PrinterReducer } from "../serv/printer"
import { SettingsActions, SettingsReducer } from "../serv/settings"

import migrate from "../db/migration";

const thunkM = thunk.withExtraArgument({
  db: window.db,
  usb: window.usb,
});

function createRootReducer() {
  return combineReducers({
    app: AppReducer,
    unitList: UnitReducer,
    counter: CounterReducer,
    dashboard: DashboardReducer,
    saleJournal: SaleJournalReducer,
    priceList: PriceReducer,
    productList: ProductReducer,
    categoryList: CategoryReducer,
    saleCheck: SaleCheckReducer,
    consignment: ConsignmentReducer,
    registry: RegistryReducer,
    supplier: SupplierReducer,
    client: ClientReducer,
    acl: AclReducer,
    printer: PrinterReducer,
    settings: SettingsReducer,
  });
}

function devCreateStore() {
  const { logger } = require("redux-logger");
  const middleware = [thunkM];
  const enhancers = [];
  middleware.push(logger);
  const actionCreators = {
    ...UnitActions,
    ...PriceActions,
    ...CounterActions,
    ...DashboardActions,
    ...SaleJournalActions,
    ...ProductActions,
    ...CategoryActions,
    ...RegistryActions,
    ...SaleCheckActions,
    ...ConsignmentActions,
    ...SupplierActions,
    ...ClientActions,
    ...AclActions,
    ...PrinterActions,
    ...SettingsActions,
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

migrate(window.db)
  .then(async () => {
    store.dispatch(RegistryActions.reloadUnits());
    store.dispatch(RegistryActions.reloadCategories());
    store.dispatch(RegistryActions.reloadSuppliers());
    store.dispatch(RegistryActions.reloadClients());
  })
  .catch(err => console.log(err));

export default store;
