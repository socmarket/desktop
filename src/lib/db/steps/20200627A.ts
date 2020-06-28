import addCurrentConsignmentAndReturnSql from "./sql/20200627AddCurrentConsignmentAndReturn.sql"

export default function step(db, thisStepName) {
  return db.batch(addCurrentConsignmentAndReturnSql)
}

