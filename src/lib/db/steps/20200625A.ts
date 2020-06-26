import addCurrentSaleCheckSql from "./sql/20200625AddCurrentSaleCheck.sql"
import addCurrencyTableSql    from "./sql/20200625AddCurrencyTable.sql"

export default function step(db, thisStepName) {
  return db.batch(addCurrentSaleCheckSql)
    .then(_ => db.batch(addCurrencyTableSql))
}
