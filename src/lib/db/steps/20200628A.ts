import addClientSupplierBalanceCurrencySql from "./sql/20200628AddClientSupplierBalanceCurrency.sql"

export default function step(db, thisStepName) {
  return db.batch(addClientSupplierBalanceCurrencySql)
}


