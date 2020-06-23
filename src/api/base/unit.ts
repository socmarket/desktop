import selectUnitByIdSql    from "./sql/unit/selectUnitById.sql"
import selectUnitByTitleSql from "./sql/unit/selectUnitByTitle.sql"

export interface Unit {
  id: number
  title: string
  notation: string
}

export interface UnitApi {
  pick(id: number): Promise<Unit>
  find(pattern: string): Promise<Unit[]>
}

export default function initUnitApi(db) {
  return {
    pick: (id: number) => db.selectOne<Unit>(selectUnitByIdSql, { $unitId: id }),
    find: (titlePattern: string) => db.select<Unit>(selectUnitByTitleSql, { $pattern: titlePattern.toLowerCase() })
  }
}
