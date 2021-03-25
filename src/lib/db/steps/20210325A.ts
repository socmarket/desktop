import addUnitAskQuantitySql from "./sql/20210325AddUnitAskQuantity.sql"


export default function step(db, thisStepName) {
  return db.batch(addUnitAskQuantitySql)
}

