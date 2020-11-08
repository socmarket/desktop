import multiSaleCheckEditorSql from "./sql/20201104MultiSaleCheckEditor.sql"

export default function step(db, thisStepName) {
  return db.batch(multiSaleCheckEditorSql)
}
