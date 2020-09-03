import createSyncSql from "./sql/20200903CreateSync.sql"

export default function step(db, thisStepName) {
  return db.batch(createSyncSql)
}
