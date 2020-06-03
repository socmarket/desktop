import { Database } from "./db"

// @ts-ignore
import selectCategoryById from "./sql/category/selectCategoryById.sql"
import selectCategoryByTitle from "./sql/category/selectCategoryByTitle.sql"

export interface Category {
  id: number;
  parentId: number;
  title: string;
  parentTitle: string;
};

export interface CategoryApi {
  find(pattern: string): Promise<Category[]>;
};

export default function initCategoryApi(db: Database): CategoryApi {
  return {
    pick: (id: number) => db.selectOne<Category>(selectCategoryById, { $categoryId: id }),
    find: (titlePattern: string) => db.select<Category>(selectCategoryByTitle, { $pattern: titlePattern.toLowerCase() })
  };
};
