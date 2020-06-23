import selectCategoryByIdSql    from "./sql/category/selectCategoryById.sql"
import selectCategoryByTitleSql from "./sql/category/selectCategoryByTitle.sql"

export interface Category {
  id: number
  parentId: number
  title: string
  parentTitle: string
}

export interface CategoryApi {
  pick(id: number): Promise<Category>
  find(pattern: string): Promise<Category[]>
}

export default function initCategoryApi(db: Database): CategoryApi {
  return {
    pick: (id: number) => db.selectOne<Category>(selectCategoryByIdSql, { $categoryId: id }),
    find: (titlePattern: string) => db.select<Category>(selectCategoryByTitleSql, { $pattern: titlePattern.toLowerCase() })
  }
}
