import createAuthTableSql from "./sql/20200809CreateAuthTable.sql"

export default function step(db, thisStepName) {
  return db.batch(createAuthTableSql)
}

