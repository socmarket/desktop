import initClientApi, {
  Client,
  ClientApi,
} from "./client"

import initCategoryApi, {
  CategoryApi,
} from "./category"

import initProductApi, {
  ProductApi,
} from "./product"

import initSaleCheckApi, {
  SaleCheckApi,
} from "./product"

import initReportApi, {
  ReportApi,
} from "./report"

import Database from "./internal/db"
import { initUsb } from "./internal/usb"

export * from "./client";
export * from "./category";
export * from "./product";
export * from "./salecheck";

export interface Api {
  _db: Database;
  _usb: object;
  client: ClientApi;
  product: ProductApi;
  category: CategoryApi;
  saleCheck: SaleCheckApi;
  report: ReportApi;
}

export default function initApi(
  dbFilePath: string
): Api {
  const db = Database(dbFilePath);
  const usb = initUsb();
  return {
    _db: db,
    _usb: usb,
    client: initClientApi(db),
    product: initProductApi(db),
    category: initCategoryApi(db),
    saleCheck: initSaleCheckApi(db),
    report: initReportApi(db),
  };
}
