import multiConsignmentEditorSql from "./sql/20201110MultiConsignmentEditor.sql"

export default function step(db, thisStepName) {
  return db.batch(multiConsignmentEditorSql)
}
