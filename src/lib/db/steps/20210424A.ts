import addArchivedAndOrderToProductSql from "./sql/20210424AddArchivedAndOrderNoToProduct.sql"

export default function step(db, thisStepName) {
  return db.batch(addArchivedAndOrderToProductSql)
}
