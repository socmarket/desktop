import selectConsignmentSql            from "./sql/consignment/selectConsignment.sql"
import selectConsignmentItemsSql       from "./sql/consignment/selectConsignmentItems.sql"
import insertConsignmentItemSql        from "./sql/consignment/insertConsignmentItem.sql"
import updateConsignmentItemSql        from "./sql/consignment/updateConsignmentItem.sql"
import deleteConsignmentItemSql        from "./sql/consignment/deleteConsignmentItem.sql"
import setReturnConsignmentIdSql       from "./sql/consignment/setReturnConsignmentId.sql"
import updateConsignmentReturnsSql     from "./sql/consignment/updateConsignmentReturns.sql"
import openConsignmentSql              from "./sql/consignment/openConsignment.sql"
import closeConsignmentSql             from "./sql/consignment/closeConsignment.sql"
import selectConsignmentsSql           from "./sql/consignment/selectConsignments.sql"
import selectConsignmentItemsForSql    from "./sql/consignment/selectConsignmentItemsFor.sql"
import selectConsignmentByProductIdSql from "./sql/consignment/selectConsignmentByProductId.sql"

import { groupBy } from "../util"

import X from "xlsx"

export default function initConsignmentApi(db) {
  return {
    productHistory: (productId) => (
      db.select(selectConsignmentByProductIdSql, { $productId: productId })
    ),
    openConsignment: (consignmentId) => {
      return db
        .exec("delete from currentconsignment where consignmentId = $consignmentId", { $consignmentId: consignmentId })
        .then(_ => db.exec(openConsignmentSql, { $consignmentId: consignmentId }))
    },
    selectConsignment: (consignmentId) => {
      function selectItems() {
        return db.select(selectConsignmentItemsSql, { $consignmentId: consignmentId })
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
      }
      if (consignmentId < 0) {
        return selectItems()
      } else {
        return db
          .selectOne(selectConsignmentSql, { $id: consignmentId })
          .then(({ supplierId, acceptedAt, acceptedAtDate, acceptedAtTime }) => {
            return selectItems().then(items => ({
              ...items,
              supplierId: supplierId,
              acceptedAt: acceptedAt,
              acceptedAtDate: acceptedAtDate,
              acceptedAtTime: acceptedAtTime,
            }))
          })
      }
    },
    insertConsignmentItem: (item) => {
      return db.exec(insertConsignmentItemSql, {
        $productId     : item.productId,
        $quantity      : item.quantity,
        $price         : item.price,
        $unitId        : item.unitId,
        $currencyId    : item.currencyId,
        $consignmentId : item.consignmentId,
      })
    },
    deleteConsignmentItem: (item) => {
      return db.exec(deleteConsignmentItemSql, {
        $id : item.id
      })
    },
    updateConsignmentItem: (item) => (
      db.exec(updateConsignmentItemSql, {
        $id         : item.id,
        $productId  : item.productId,
        $quantity   : item.quantity,
        $price      : item.price,
        $unitId     : item.unitId,
        $currencyId : item.currencyId,
      })
    ),
    closeConsignment: ({ supplierId, consignmentId }) => {
      function updateConsignment() {
        return Promise.resolve()
          .then(_ => db.exec("begin"))
          .then(_ => db.exec("update consignment set supplierId = ? where id = ?", [
            supplierId,
            consignmentId
          ]))
          .then(_ => db.exec(setReturnConsignmentIdSql, { $consignmentId: consignmentId }))
          .then(_ => db.exec("delete from consignmentitem where consignmentId = ?", [ consignmentId ]))
          .then(_ => db.exec(closeConsignmentSql, { $consignmentId: consignmentId, $currentConsignmentId: consignmentId }))
          .then(_ => db.exec("update consignment set closed = true where id = ?", [ consignmentId ]))
          .then(_ => db.exec("delete from currentconsignment where consignmentId = ?", [ consignmentId ]))
          .then(_ => db.exec(updateConsignmentReturnsSql, { $consignmentId: consignmentId }))
          .then(_ => db.exec("commit"))
          .catch(err => {
            console.log(err)
            return db.exec("rollback")
          })
      }
      function createConsignment() {
        return Promise.resolve()
          .then(_ => db.exec("begin"))
          .then(_ => db.exec("insert into consignment(supplierId) values(?)", [ supplierId ]))
          .then(_ => db.selectOne("select id as newConsignmentId from consignment where id in (select max(id) from consignment)"))
          .then(({ newConsignmentId }) => {
            return db.exec(closeConsignmentSql, { $consignmentId: -1, $currentConsignmentId: newConsignmentId })
              .then(_ => db.exec("update consignment set closed = true where id = ?", [ newConsignmentId ]))
              .then(_ => db.exec("delete from currentconsignment where consignmentId = -1"))
          })
          .then(_ => db.exec("commit"))
          .catch(err => {
            console.log(err)
            return db.exec("rollback")
          })
      }
      if (consignmentId < 0) {
        return createConsignment()
      } else {
        return updateConsignment()
      }
    },
    clearConsignment: (consignmentId) => {
      return db.exec("delete from currentconsignment where consignmentId = $consignmentId", { $consignmentId: consignmentId })
    },
    selectConsignmentJournal: async (day, all, consignment) => {
      const consignments = await db.select(selectConsignmentsSql, { $all: all, $day: day, $noConsignmentId: true, $consignmentId: 0 });
      const filtered     = await db.select(selectConsignmentsSql, { $all: all, $day: day, $noConsignmentId: !consignment,
                                                                    $consignmentId: consignment ? consignment.consignment.id : 0 });
      const withItems    = await Promise.all(
                             filtered.map(consignment =>
                               db.select(selectConsignmentItemsForSql, { $consignmentId: consignment.id })
                                 .then(items => ({ consignment: consignment, items: items }))
                           ));
      return { list: consignments, items: withItems }
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

