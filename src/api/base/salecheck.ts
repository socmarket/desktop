import selectCurrentSaleCheckItemsSql from "./sql/salecheck/selectCurrentSaleCheckItems.sql"
import insertCurrentSaleCheckItemSql  from "./sql/salecheck/insertCurrentSaleCheckItem.sql"
import updateCurrentSaleCheckItemSql  from "./sql/salecheck/updateCurrentSaleCheckItem.sql"
import deleteCurrentSaleCheckItemSql  from "./sql/salecheck/deleteCurrentSaleCheckItem.sql"
import closeCurrentSaleCheckSql       from "./sql/salecheck/closeCurrentSaleCheck.sql"
import selectSaleChecksSql            from "./sql/salecheck/selectSaleChecks.sql"
import selectSaleCheckItemsForSql     from "./sql/salecheck/selectSaleCheckItemsFor.sql"

export default function initSaleCheckApi(db) {
  return {
    selectCurrentSaleCheck: () => (
      db.select(selectCurrentSaleCheckItemsSql)
        .then(rows => {
          if (rows) {
            const cost  = rows.map(x => x.cost ).reduce((a, b) => a + b, 0)
            const total = rows.map(x => x.total).reduce((a, b) => a + b, 0)
            return {
              cost     : cost,
              discount : cost - total,
              total    : total,
              items    : rows,
            }
          } else {
            return {
              cost     : 0,
              discount : 0,
              total    : 0,
              items    : [],
            }
          }
        })
    ),
    insertCurrentSaleCheckItem: (item) => {
      const price = Math.round(Math.random() * 100)
      return db.exec(insertCurrentSaleCheckItemSql, {
        $productId     : item.productId,
        $quantity      : item.quantity,
        $price         : price,
        $unitId        : 1,
        $currencyId    : 1,
      })
    },
    deleteCurrentSaleCheckItem: (item) => {
      return db.exec(deleteCurrentSaleCheckItemSql, {
        $id : item.id
      })
    },
    updateCurrentSaleCheckItem: (item) => (
      db.exec(updateCurrentSaleCheckItemSql, {
        $id         : item.id,
        $productId  : item.productId,
        $quantity   : item.quantity,
        $price      : item.price,
        $unitId     : item.unitId,
        $currencyId : item.currencyId,
      })
    ),
    closeCurrentSaleCheck: ({ total, extraDiscount, cash, clientId }) => {
      const change = +cash - (total - extraDiscount)
      return Promise.resolve()
        .then(_ => db.exec("begin"))
        .then(_ => db.exec("insert into salecheck(cash, discount, change, clientId) values(?, ?, ?, ?)", [ cash, extraDiscount, change, clientId ]))
        .then(_ => db.selectOne("select id as saleCheckId from salecheck where id in (select max(id) from salecheck)"))
        .then(({ saleCheckId }) => {
          return db.exec(closeCurrentSaleCheckSql, { $saleCheckId: saleCheckId })
            .then(_ => db.exec("update salecheck set closed = true where id = ?", [ saleCheckId ]))
            .then(_ => db.exec("delete from currentsalecheck"))
        })
        .then(_ => db.exec("commit"))
        .catch(err => {
          console.log(err);
          return db.exec("rollback");
        })
    },
    selectSaleJournal: () => {
      return db.select(selectSaleChecksSql)
        .then(items => {
          return Promise.all(
            items.map(saleCheck =>
              db.select(selectSaleCheckItemsForSql, { $saleCheckId: saleCheck.id })
                .then(items => ({ saleCheck: saleCheck, items: items }))
            )
          )
        })
      ;
    }
  }
}
