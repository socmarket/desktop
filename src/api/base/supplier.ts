import selectSupplierByIdSql   from "./sql/supplier/selectSupplierById.sql"
import selectSupplierByNameSql from "./sql/supplier/selectSupplierByName.sql"

export interface Supplier {
  id: number
  name: string
}

export interface SupplierApi {
  pick(id: number): Promise<Supplier>
  find(pattern: string): Promise<Supplier[]>
}

export default function initSupplierApi(db) {
  return {
    pick: (id: number) => db.selectOne<Supplier>(selectSupplierByIdSql, { $supplierId: id }),
    find: (namePattern: string) => db.select<Supplier>(selectSupplierByNameSql, { $pattern: namePattern.toLowerCase() })
  }
}
