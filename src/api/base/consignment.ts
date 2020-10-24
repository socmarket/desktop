import selectCurrentConsignmentItemsSql from "./sql/consignment/selectCurrentConsignmentItems.sql"
import insertCurrentConsignmentItemSql  from "./sql/consignment/insertCurrentConsignmentItem.sql"
import updateCurrentConsignmentItemSql  from "./sql/consignment/updateCurrentConsignmentItem.sql"
import deleteCurrentConsignmentItemSql  from "./sql/consignment/deleteCurrentConsignmentItem.sql"
import closeCurrentConsignmentSql       from "./sql/consignment/closeCurrentConsignment.sql"
import selectConsignmentsSql            from "./sql/consignment/selectConsignments.sql"
import selectConsignmentItemsForSql     from "./sql/consignment/selectConsignmentItemsFor.sql"
import selectConsignmentByProductIdSql  from "./sql/consignment/selectConsignmentByProductId.sql"

import { groupBy } from "../util"

import X from "xlsx"

export default function initConsignmentApi(db) {
  return {
    productHistory: (productId) => (
      db.select(selectConsignmentByProductIdSql, { $productId: productId })
    ),
    selectCurrentConsignment: () => (
      db.select(selectCurrentConsignmentItemsSql)
        .then(rows => {
          if (rows) {
            const cost = rows.map(x => x.cost).reduce((a, b) => a + b, 0)
            return {
              cost     : cost,
              items    : rows,
            }
          } else {
            return {
              cost     : 0,
              items    : [],
            }
          }
        })
    ),
    insertCurrentConsignmentItem: (item) => {
      return db.exec(insertCurrentConsignmentItemSql, {
        $productId     : item.productId,
        $quantity      : item.quantity,
        $price         : item.price,
        $unitId        : item.unitId,
        $currencyId    : item.currencyId,
      })
    },
    deleteCurrentConsignmentItem: (item) => {
      return db.exec(deleteCurrentConsignmentItemSql, {
        $id : item.id
      })
    },
    updateCurrentConsignmentItem: (item) => (
      db.exec(updateCurrentConsignmentItemSql, {
        $id         : item.id,
        $productId  : item.productId,
        $quantity   : item.quantity,
        $price      : item.price,
        $unitId     : item.unitId,
        $currencyId : item.currencyId,
      })
    ),
    closeCurrentConsignment: ({ supplierId }) => {
      return Promise.resolve()
        .then(_ => db.exec("begin"))
        .then(_ => db.exec("insert into consignment(supplierId) values(?)", [ supplierId ]))
        .then(_ => db.selectOne("select id as consignmentId from consignment where id in (select max(id) from consignment)"))
        .then(({ consignmentId }) => {
          return db.exec(closeCurrentConsignmentSql, { $consignmentId: consignmentId })
            .then(_ => db.exec("update consignment set closed = true where id = ?", [ consignmentId ]))
            .then(_ => db.exec("delete from currentconsignment"))
        })
        .then(_ => db.exec("commit"))
        .catch(err => {
          console.log(err)
          return db.exec("rollback")
        })
    },
    clearCurrentConsignment: () => {
      return db.exec("delete from currentconsignment")
    },
    selectConsignmentJournal: (day, all) => {
      return db.select(selectConsignmentsSql, { $all: all, $day: day })
        .then(items => {
          return Promise.all(
            items.map(consignment =>
              db.select(selectConsignmentItemsForSql, { $consignmentId: consignment.id })
                .then(items => ({ consignment: consignment, items: items }))
            )
          )
        })
        .then(items => groupBy(x => x.consignment.acceptedAtDate, items, x => x.consignment.acceptedAt))
    },
    returnConsignmentItem: (consignmentItemId, quantity) => {
      return db.selectOne("select id, quantity from consignmentreturn where consignmentItemId = ?", [ consignmentItemId ])
        .then(item => {
          if (item) {
            return db.exec(
              "update consignmentreturn set quantity = quantity + ?, returnedAt = current_timestamp where consignmentItemId = ?",
              [ quantity * 100, consignmentItemId ]
            )
          } else {
            return db.exec(
              "insert into consignmentreturn(consignmentItemId, quantity) values(?, ?)",
              [ consignmentItemId, quantity * 100 ]
            )
          }
        })
    },
    selectLastConsignmentPrice: (productId) => {
      return db.selectOne("select price / 100.00 as price from consignmentprice where productId = $productId order by updatedAt desc limit 1", {
          $productId: productId,
        })
        .then(item => {
          if (item) {
            return item.price
          } else {
            return 0
          }
        })
    },
    exportToExcel: (file, items, header) => {
      const hdr = header.map(x => [[ x ]])
      const data = hdr
        .concat(
          [[ "Товар", "Кол-во", "Ед.изм.", "Штрихкод", ]],
        ).concat(
          items.map(item => [
            item.productTitle,
            item.quantity,
            item.unitTitle,
            item.productBarcode,
          ])
        )
      const wb = X.utils.book_new()
      const ws = {
        ...(X.utils.aoa_to_sheet(data)),
        "!ref": `A1:G${data.length+1}`,
        "!merges": hdr.map((h, idx) => ({
          s: {c: 0, r: idx},
          e: {c: 6, r: idx},
        }))
      }
      X.utils.book_append_sheet(wb, ws, "consignment1")
      X.writeFile(wb, file.path);
    },
  }
}

