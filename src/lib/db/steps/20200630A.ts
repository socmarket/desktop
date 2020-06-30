import MigrateOldReturnsCurrenciesSql from "./sql/20200630MigrateOldReturnsCurrencies.sql";
import AddDefaultCurrenciesSql        from "./sql/20200630AddDefaultCurrencies.sql";
import AddDefaultUnitsSql             from "./sql/20200630AddDefaultUnits.sql";
import AddDefaultClientSql            from "./sql/20200630AddDefaultClient.sql";
import AddDefaultSupplierSql          from "./sql/20200630AddDefaultSupplier.sql";

export default function step(db, thisStepName) {
  return db.batch(MigrateOldReturnsCurrenciesSql)
    .then(_ => db.select("select * from currency"))
    .then(currs => {
      console.log(currs)
      if (currs.length === 0) {
        return db.batch(AddDefaultCurrenciesSql)
      } else {
        return Promise.resolve()
      }
    })
    .then(_ => db.select("select * from unit"))
    .then(currs => {
      if (currs.length === 0) {
        return db.batch(AddDefaultUnitsSql)
      } else {
        return Promise.resolve()
      }
    })
    .then(_ => db.select("select * from client"))
    .then(currs => {
      if (currs.length === 0) {
        return db.batch(AddDefaultClientSql)
      } else {
        return Promise.resolve()
      }
    })
    .then(_ => db.select("select * from supplier"))
    .then(currs => {
      if (currs.length === 0) {
        return db.batch(AddDefaultSupplierSql)
      } else {
        return Promise.resolve()
      }
    })
}

