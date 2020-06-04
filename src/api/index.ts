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

import Database from "./db"

export * from "./client";
export * from "./category";
export * from "./product";
export * from "./salecheck";

export interface Api {
  client: ClientApi;
  product: ProductApi;
  category: CategoryApi;
  saleCheck: SaleCheckApi;
}

export default function initApi(
  dbFilePath: string
): Api {
  const db = Database(dbFilePath);
  return {
    client: initClientApi(db),
    product: initProductApi(db),
    category: initCategoryApi(db),
    saleCheck: initSaleCheckApi(db),
  };
}
