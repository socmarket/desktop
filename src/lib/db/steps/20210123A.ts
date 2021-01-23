import createInventorySql from "./sql/20210123CreateInventory.sql"

export default function step(db, thisStepName) {
  return db.batch(createInventorySql)
}
