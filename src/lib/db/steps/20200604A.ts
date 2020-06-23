import addClientSupplierBalanceSql from "./sql/20200604AddClientSupplierBalance.sql"

export default function step(db, thisStepName) {
  return db.batch(addClientSupplierBalanceSql);
}
