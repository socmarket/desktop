import selectCurrentConsignmentItemsSql from "./sql/consignment/selectCurrentConsignmentItems.sql"
import insertCurrentConsignmentItemSql  from "./sql/consignment/insertCurrentConsignmentItem.sql"
import updateCurrentConsignmentItemSql  from "./sql/consignment/updateCurrentConsignmentItem.sql"
import deleteCurrentConsignmentItemSql  from "./sql/consignment/deleteCurrentConsignmentItem.sql"
import closeCurrentConsignmentSql       from "./sql/consignment/closeCurrentConsignment.sql"
import selectConsignmentsSql            from "./sql/consignment/selectConsignments.sql"
import selectConsignmentItemsForSql     from "./sql/consignment/selectConsignmentItemsFor.sql"

export default function initConsignmentApi(db) {
  return {
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
    selectConsignmentJournal: () => {
      return db.select(selectConsignmentsSql)
        .then(items => {
          return Promise.all(
            items.map(consignment =>
              db.select(selectConsignmentItemsForSql, { $consignmentId: consignment.id })
                .then(items => ({ consignment: consignment, items: items }))
            )
          )
        })
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
    }
  }
}

