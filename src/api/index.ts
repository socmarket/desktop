import initCategoryApi, {
  Category,
  CategoryApi,
} from "./category"
import Database from "./db"


export { Category, CategoryApi };

export interface Api {
  category: CategoryApi;
}

export default function initApi(
  dbFilePath: string
): Api {
  const db = Database(dbFilePath);
  return {
    category: initCategoryApi(db),
  };
}
