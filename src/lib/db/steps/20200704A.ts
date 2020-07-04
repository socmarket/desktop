import addImportInfoSql from "./sql/20200704AddImportInfo.sql"

export default function step(db, thisStepName) {
  return db.batch(addImportInfoSql)
}

