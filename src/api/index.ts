import initAutoProductApi, {
  AutoProductApi,
} from "./auto/parts/product"

import initSettingsApi, {
  SettingsApi,
} from "./base/settings"

import initUnitApi, {
  UnitApi,
} from "./base/unit"

import initClientApi, {
  ClientApi,
} from "./base/client"

import initCategoryApi, {
  CategoryApi,
} from "./base/category"

import initSaleCheckApi, {
  SaleCheckApi,
} from "./base/salecheck"

export function initApi(db, usb) {
  return {
    autoParts: {
      product: initAutoProductApi(db),
    },
    unit: initUnitApi(db),
    client: initClientApi(db),
    category: initCategoryApi(db),
    settings: initSettingsApi(db),
    saleCheck: initSaleCheckApi(db),
    migrateDb: () => db.migrate(),
  }
}
