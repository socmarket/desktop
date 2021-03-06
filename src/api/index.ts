import initAutoProductApi, {
  AutoProductApi,
} from "./auto/parts/product"

import initProductApi, {
  ProductApi,
} from "./base/product"

import initInventoryApi, {
  InventoryApi,
} from "./base/inventory"

import initSettingsApi, {
  SettingsApi,
} from "./base/settings"

import initUnitApi, {
  UnitApi,
} from "./base/unit"

import initCurrencyApi, {
  CurrencyApi,
} from "./base/currency"

import initClientApi, {
  ClientApi,
} from "./base/client"

import initSupplierApi, {
  SupplierApi,
} from "./base/supplier"

import initCategoryApi, {
  CategoryApi,
} from "./base/category"

import initSaleCheckApi, {
  SaleCheckApi,
} from "./base/salecheck"

import initConsignmentApi, {
  ConsignmentApi,
} from "./base/consignment"

import initPriceApi, {
  PriceApi,
} from "./base/price"

import initReportApi, {
  ReportApi,
} from "./base/report"

import initPrinterApi, {
  PrinterApi,
} from "./base/printer"

import initFileApi, {
  FileApi,
} from "./base/file"

import initServerApi from "./server"

export function initApi(db, usb) {
  return {
    autoParts: {
      product: initAutoProductApi(db),
    },
    unit: initUnitApi(db),
    currency: initCurrencyApi(db),
    client: initClientApi(db),
    supplier: initSupplierApi(db),
    category: initCategoryApi(db),
    settings: initSettingsApi(db),
    saleCheck: initSaleCheckApi(db),
    consignment: initConsignmentApi(db),
    price: initPriceApi(db),
    report: initReportApi(db),
    printer: initPrinterApi(db, usb),
    file: initFileApi(db),
    server: initServerApi(db),
    product: initProductApi(db),
    inventory: initInventoryApi(db),
    migrateDb: () => db.migrate(),
  }
}
