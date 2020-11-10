import addSaleCheckIdToReturnSql  from "./sql/20201110AddSaleCheckIdToReturn.sql"

export default function step(db, thisStepName) {
  return db.batch(addSaleCheckIdToReturnSql)
}
