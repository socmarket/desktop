import addConsignmentPriceSql from "./sql/20200703AddConsignmentPrice.sql"

export default function step(db, thisStepName) {
  return db.batch(addConsignmentPriceSql)
}
