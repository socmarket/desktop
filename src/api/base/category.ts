import insertCategorySql        from "./sql/category/insertCategory.sql"
import updateCategorySql        from "./sql/category/updateCategory.sql"
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
    find: (titlePattern: string) => db.select<Category>(selectCategoryByTitleSql, { $pattern: titlePattern.toLowerCase() }),
    insert: (category) => (
      db.exec(insertCategorySql, {
        $title      : category.title  || "",
        $titleLower : (category.title || "").toLowerCase(),
        $notes      : category.notes  || "",
      })
    ),
    update: (category) => (
      db
        .exec(updateCategorySql, {
          $id         : category.id          ,
          $title      : category.title  || "",
          $titleLower : (category.title || "").toLowerCase(),
          $notes      : category.notes  || "",
        })
        .then(_ => db.exec("delete from sync where entity = 'category' and id = $id", { $id: category.id }))
    ),
  }
}
