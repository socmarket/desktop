import initAutoProductApi, {
  AutoProductApi,
} from "./auto/parts/product"

import initSettingsApi, {
  SettingsApi,
} from "./base/settings"

import initUnitApi, {
  UnitApi,
} from "./base/unit"

import initCategoryApi, {
  CategoryApi,
} from "./base/category"

export function initApi(db, usb) {
  return {
    autoParts: {
      product: initAutoProductApi(db),
    },
    unit: initUnitApi(db),
    category: initCategoryApi(db),
    settings: initSettingsApi(db),
    migrateDb: () => db.migrate(),
  }
}
