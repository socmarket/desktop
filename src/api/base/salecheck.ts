import selectCurrentSaleCheckItemsSql from "./sql/salecheck/selectCurrentSaleCheckItems.sql"
import insertCurrentSaleCheckItemSql  from "./sql/salecheck/insertCurrentSaleCheckItem.sql"
import updateCurrentSaleCheckItemSql  from "./sql/salecheck/updateCurrentSaleCheckItem.sql"
import deleteCurrentSaleCheckItemSql  from "./sql/salecheck/deleteCurrentSaleCheckItem.sql"
import closeCurrentSaleCheckSql       from "./sql/salecheck/closeCurrentSaleCheck.sql"
import selectSaleChecksSql            from "./sql/salecheck/selectSaleChecks.sql"
import selectSaleCheckItemsForSql     from "./sql/salecheck/selectSaleCheckItemsFor.sql"

import { groupBy } from "../util"

import X from "xlsx"

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
      return db.exec(insertCurrentSaleCheckItemSql, {
        $productId     : item.productId,
        $quantity      : item.quantity,
        $price         : item.price,
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
    clearCurrentSaleCheck: () => {
      return db.exec("delete from currentsalecheck")
    },
    closeCurrentSaleCheck: ({ total, extraDiscount, cash, clientId }) => {
      const change = +cash - (total - extraDiscount)
      return Promise.resolve()
        .then(_ => db.exec("begin"))
        .then(_ => db.exec("insert into salecheck(cash, discount, change, clientId) values(?, ?, ?, ?)", [
          cash * 100,
          extraDiscount * 100,
          change * 100,
          clientId
        ]))
        .then(_ => db.selectOne("select id as saleCheckId from salecheck where id in (select max(id) from salecheck)"))
        .then(({ saleCheckId }) => {
          return db.exec(closeCurrentSaleCheckSql, { $saleCheckId: saleCheckId })
            .then(_ => db.exec("update salecheck set closed = true where id = ?", [ saleCheckId ]))
            .then(_ => db.exec("delete from currentsalecheck"))
        })
        .then(_ => db.exec("commit"))
        .catch(err => {
          console.log(err)
          return db.exec("rollback")
        })
    },
    selectSaleJournal: async (day, all, saleCheck) => {
      const saleChecks = await db.select(selectSaleChecksSql, { $all: all, $day: day, $noSaleCheckId: true, $saleCheckId: 0 });
      const filtered   = await db.select(selectSaleChecksSql, { $all: all, $day: day, $noSaleCheckId: !saleCheck, $saleCheckId: saleCheck ? saleCheck.saleCheck.id : 0 });
      const withItems  = await Promise.all(
                           filtered.map(saleCheck =>
                             db.select(selectSaleCheckItemsForSql, { $saleCheckId: saleCheck.id })
                               .then(items => ({ saleCheck: saleCheck, items: items }))
                         ));
      return { list: saleChecks, items: withItems }
    },
    selectSaleCheckList: (day, all) => {
      return db.select(selectSaleChecksSql, { $all: all, $day: day })
    },
    returnSaleCheckItem: (saleCheckItemId, quantity) => {
      return db.selectOne("select id, quantity from salecheckreturn where saleCheckItemId = ?", [ saleCheckItemId ])
        .then(item => {
          if (item) {
            return db.exec(
              "update salecheckreturn set quantity = quantity + ?, returnedAt = current_timestamp where saleCheckItemId = ?",
              [ quantity * 100, saleCheckItemId ]
            )
          } else {
            return db.exec(
              "insert into salecheckreturn(saleCheckItemId, quantity) values(?, ?)",
              [ saleCheckItemId, quantity * 100 ]
            )
          }
        })
    },
    exportToExcel: (file, items, header) => {
      const hdr = header.map(x => [[ x ]])
      const data = hdr
        .concat(
          [[ "Товар", "Кол-во", "Ед.изм.", "Цена", "Сумма", "Валюта", "Штрихкод", ]],
        ).concat(
          items.map(item => [
            item.productTitle,
            item.quantity,
            item.unitTitle,
            item.price,
            item.total,
            item.currencyTitle,
            item.productBarcode,
          ])
        )
      const wb = X.utils.book_new()
      const ws = {
        ...(X.utils.aoa_to_sheet(data)),
        [`E${data.length+1}`]: { f: `=SUM(E2:E${data.length})` },
        "!ref": `A1:G${data.length+1}`,
        "!merges": hdr.map((h, idx) => ({
          s: {c: 0, r: idx},
          e: {c: 6, r: idx},
        }))
      }
      X.utils.book_append_sheet(wb, ws, "check1")
      X.writeFile(wb, file.path);
    },
  }
}
