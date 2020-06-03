import initClientApi, {
  Client,
  ClientApi,
} from "./client"

import initCategoryApi, {
  Category,
  CategoryApi,
} from "./category"

import Database from "./db"


export { Client, ClientApi };
export { Category, CategoryApi };

export interface Api {
  client: ClientApi;
  category: CategoryApi;
}

export default function initApi(
  dbFilePath: string
): Api {
  const db = Database(dbFilePath);
  return {
    client: initClientApi(db),
    category: initCategoryApi(db),
  };
}
