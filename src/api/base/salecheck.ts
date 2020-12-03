import selectSaleCheckSql         from "./sql/salecheck/selectSaleCheck.sql"
import selectSaleCheckItemsSql    from "./sql/salecheck/selectSaleCheckItems.sql"
import insertSaleCheckItemSql     from "./sql/salecheck/insertSaleCheckItem.sql"
import updateSaleCheckItemSql     from "./sql/salecheck/updateSaleCheckItem.sql"
import setReturnSaleCheckIdSql    from "./sql/salecheck/setReturnSaleCheckId.sql"
import updateSaleCheckReturnsSql  from "./sql/salecheck/updateSaleCheckReturns.sql"
import deleteSaleCheckItemSql     from "./sql/salecheck/deleteSaleCheckItem.sql"
import openSaleCheckSql           from "./sql/salecheck/openSaleCheck.sql"
import closeSaleCheckSql          from "./sql/salecheck/closeSaleCheck.sql"
import selectSaleChecksSql        from "./sql/salecheck/selectSaleChecks.sql"
import selectSaleCheckItemsForSql from "./sql/salecheck/selectSaleCheckItemsFor.sql"

import { groupBy } from "../util"

import X from "xlsx"

export default function initSaleCheckApi(db) {
  return {
    openSaleCheck: (saleCheckId) => {
      return db
        .exec("delete from currentsalecheck where saleCheckId = $saleCheckId", { $saleCheckId: saleCheckId })
        .then(_ => db.exec(openSaleCheckSql, { $saleCheckId: saleCheckId }))
    },
    selectSaleCheck: (saleCheckId) => {
      function selectItems() {
        return db.select(selectSaleCheckItemsSql, { $saleCheckId: saleCheckId })
          .then(rows => {
            if (rows) {
              const cost  = rows.map(x => x.cost ).reduce((a, b) => a + b, 0)
              const total = rows.map(x => x.total).reduce((a, b) => a + b, 0)
              const discount = rows.map(x => x.discount).reduce((a, b) => a + b, 0)
              return {
                cost     : cost,
                discount : discount,
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
      }
      if (saleCheckId < 0) {
        return selectItems()
      } else {
        return db
          .selectOne(selectSaleCheckSql, { $id: saleCheckId })
          .then(({ clientId, cash, discount, soldAt, soldAtDate, soldAtTime }) => {
            return selectItems().then(items => ({
              ...items,
              clientId: clientId,
              cash: cash,
              extraDiscount: discount,
              soldAt: soldAt,
              soldAtDate: soldAtDate,
              soldAtTime: soldAtTime,
            }))
          })
      }
    },
    insertSaleCheckItem: (item) => {
      return db.exec(insertSaleCheckItemSql, {
        $productId     : item.productId,
        $quantity      : item.quantity,
        $price         : item.price,
        $unitId        : 1,
        $currencyId    : 1,
        $saleCheckId   : item.saleCheckId,
      })
    },
    deleteSaleCheckItem: (item) => {
      return db.exec(deleteSaleCheckItemSql, {
        $id : item.id
      })
    },
    updateSaleCheckItem: (item) => (
      db.exec(updateSaleCheckItemSql, {
        $id         : item.id,
        $productId  : item.productId,
        $quantity   : item.quantity,
        $price      : item.price,
        $unitId     : item.unitId,
        $currencyId : item.currencyId,
      })
    ),
    clearSaleCheck: (saleCheckId) => {
      return db.exec("delete from currentsalecheck where saleCheckId = $saleCheckId", { $saleCheckId: saleCheckId })
    },
    closeSaleCheck: ({ total, extraDiscount, cash, clientId, saleCheckId }) => {
      const change = +cash - (total - extraDiscount)
      function updateSaleCheck() {
        return Promise.resolve()
          .then(_ => db.exec("begin"))
          .then(_ => db.exec("update salecheck set cash = ?, discount = ?, change = ?, clientId =? where id = ?", [
            cash * 100,
            extraDiscount * 100,
            change * 100,
            clientId,
            saleCheckId
          ]))
          .then(_ => db.exec(setReturnSaleCheckIdSql, { $saleCheckId: saleCheckId }))
          .then(_ => db.exec("delete from salecheckitem where saleCheckId = ?", [ saleCheckId ]))
          .then(_ => db.exec(closeSaleCheckSql, { $saleCheckId: saleCheckId, $currentSaleCheckId: saleCheckId }))
          .then(_ => db.exec("update salecheck set closed = true where id = ?", [ saleCheckId ]))
          .then(_ => db.exec("delete from currentsalecheck where saleCheckId = ?", [ saleCheckId ]))
          .then(_ => db.exec(updateSaleCheckReturnsSql, { $saleCheckId: saleCheckId }))
          .then(_ => db.exec("commit"))
          .catch(err => {
            console.log(err)
            return db.exec("rollback")
          })
      }
      function createSaleCheck() {
        return Promise.resolve()
          .then(_ => db.exec("begin"))
          .then(_ => db.exec("insert into salecheck(cash, discount, change, clientId) values(?, ?, ?, ?)", [
            cash * 100,
            extraDiscount * 100,
            change * 100,
            clientId
          ]))
          .then(_ => db.selectOne("select id as newSaleCheckId from salecheck where id in (select max(id) from salecheck)"))
          .then(({ newSaleCheckId }) => {
            return db.exec(closeSaleCheckSql, { $saleCheckId: -1, $currentSaleCheckId: newSaleCheckId })
              .then(_ => db.exec("update salecheck set closed = true where id = ?", [ newSaleCheckId ]))
              .then(_ => db.exec("delete from currentsalecheck where saleCheckId = -1"))
          })
          .then(_ => db.exec("commit"))
          .catch(err => {
            console.log(err)
            return db.exec("rollback")
          })
      }
      if (saleCheckId < 0) {
        return createSaleCheck()
      } else {
        return updateSaleCheck()
      }
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
