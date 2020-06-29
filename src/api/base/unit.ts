import insertUnitSql        from "./sql/unit/insertUnit.sql"
import updateUnitSql        from "./sql/unit/updateUnit.sql"
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
    find: (titlePattern: string) => db.select<Unit>(selectUnitByTitleSql, { $pattern: titlePattern.toLowerCase() }),
    insert: (unit) => (
      db.exec(insertUnitSql, {
        $title         : unit.title     || "",
        $titleLower    : (unit.title    || "").toLowerCase(),
        $notation      : unit.notation  || "",
        $notationLower : (unit.notation || "").toLowerCase(),
      })
    ),
    update: (unit) => (
      db.exec(updateUnitSql, {
        $id            : unit.id             ,
        $title         : unit.title     || "",
        $titleLower    : (unit.title    || "").toLowerCase(),
        $notation      : unit.notation  || "",
        $notationLower : (unit.notation || "").toLowerCase(),
      })
    ),
  }
}
