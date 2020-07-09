import addProductCoordSql from "./sql/20200709AddProductCoord.sql"

export default function step(db, thisStepName) {
  return db.batch(addProductCoordSql)
}
