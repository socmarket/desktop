import insertSupplierSql       from "./sql/supplier/insertSupplier.sql"
import updateSupplierSql       from "./sql/supplier/updateSupplier.sql"
import selectSupplierByIdSql   from "./sql/supplier/selectSupplierById.sql"
import selectSupplierByNameSql from "./sql/supplier/selectSupplierByName.sql"
import selectJournalByIdSql    from "./sql/supplier/selectJournalById.sql"

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
    find: (namePattern: string) => db.select<Supplier>(selectSupplierByNameSql, { $pattern: namePattern.toLowerCase() }),
    selectJournalById: (supplierId) => db.select<Supplier>(selectJournalByIdSql, { $supplierId: supplierId }),
    insert: (supplier) => (
      db.exec(insertSupplierSql, {
        $name      : supplier.name     || "",
        $nameLower : (supplier.name    || "").toLowerCase(),
        $contacts  : supplier.contacts || "",
        $notes     : supplier.notes    || "",
      })
    ),
    update: (supplier) => (
      db
        .exec(updateSupplierSql, {
          $id        : supplier.id            ,
          $name      : supplier.name     || "",
          $nameLower : (supplier.name    || "").toLowerCase(),
          $contacts  : supplier.contacts || "",
          $notes     : supplier.notes    || "",
        })
        .then(_ => db.exec("delete from sync where entity = 'supplier' and id = $id", { $id: supplier.id }))
    ),
    moneyIn: ({ id, amount, currencyId }) => (
      db.exec("insert into supplierbalance(supplierId, amount, currencyId) values(?, ?, ?)", [
        id,
        amount * 100,
        currencyId,
      ])
    ),
    moneyOut: ({ id, amount, currencyId }) => (
      db.exec("insert into supplierbalance(supplierId, amount, currencyId) values(?, ?, ?)", [
        id,
        -amount * 100,
        currencyId,
      ])
    )
  }
}
