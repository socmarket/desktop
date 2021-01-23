import selectProductBySearchSql           from "./sql/inventory/selectProductBySearch.sql"
import selectProductBySearchInCategorySql from "./sql/inventory/selectProductBySearchInCategory.sql"
import selectInventoryTotalsSql           from "./sql/inventory/selectInventoryTotals.sql"
import upsertInventoryItemSql             from "./sql/inventory/upsertInventoryItem.sql"
import closeInventorySql                  from "./sql/inventory/closeInventory.sql"

import path from "path"
import X from "xlsx"

export default function initInventoryApi(db) {
  return {
    find: (inventoryId, showOnlyCorrections, patternRaw, limit = 50, offset = 0) => {
      const pattern = patternRaw.toLowerCase().trim()
      const key = pattern.split(" ").concat([ "", "", "" ])
      const query = showOnlyCorrections ?
        selectProductBySearchSql.replace("EXTRA_CONDITION", "diffQuantity <> 0") :
          selectProductBySearchSql.replace("EXTRA_CONDITION", "1 = 1")
      return db.select(query, {
        $barcode     : patternRaw,
        $key0        : key[0],
        $key1        : key[1],
        $key2        : key[2],
        $limit       : limit,
        $offset      : offset,
        $inventoryId : inventoryId,
      }).then(items => {
        return db.selectOne(selectInventoryTotalsSql, {
          $inventoryId: inventoryId,
        }).then(totals => {
          return {
            items: items,
            totals: totals,
          }
        })
      })
    },
    findInCategory: (inventoryId, showOnlyCorrections, category, patternRaw, limit = 50, offset = 0) => {
      const pattern = patternRaw.toLowerCase().trim()
      const key = pattern.split(" ").concat([ "", "", "" ])
      const query = showOnlyCorrections ?
        selectProductBySearchInCategorySql.replace("EXTRA_CONDITION", "diffQuantity <> 0") :
          selectProductBySearchInCategorySql.replace("EXTRA_CONDITION", "1 = 1")
      return db.select(query, {
        $barcode     : patternRaw,
        $categoryId  : category.id,
        $key0        : key[0],
        $key1        : key[1],
        $key2        : key[2],
        $limit       : limit,
        $offset      : offset,
        $inventoryId : inventoryId,
      }).then(items => {
        return db.selectOne(selectInventoryTotalsSql, {
          $inventoryId: inventoryId,
        }).then(totals => ({
          items: items,
          totals: totals,
        }))
      })
    },
    upsertInventoryItem: (item) => (
      db.exec(upsertInventoryItemSql, {
        $id             : item.id,
        $productId      : item.productId,
        $productTitle   : item.productTitle,
        $quantity       : item.quantity,
        $actualQuantity : item.actualQuantity,
        $sellPrice      : item.sellPrice,
        $costPrice      : item.costPrice,
        $unitId         : item.unitId,
        $currencyId     : item.currencyId,
        $inventoryId    : item.inventoryId,
      }).then(_ => db.exec(
        "delete from currentinventory where round(diffQuantity) = 0 and inventoryId = ?",
        [ item.inventoryId ]
      ))
    ),
    closeInventory: ({ responsibleStaffId, inventoryId }) => {
      function updateInventory() {
        return Promise.resolve()
          .then(_ => db.exec("begin"))
          .then(_ => db.exec("update inventory set responsibleStaffId = ? where id = ?", [
            responsibleStaffId,
            inventoryId
          ]))
          .then(_ => db.exec("delete from inventoryitem where inventoryId = ?", [ inventoryId ]))
          .then(_ => db.exec(closeInventorySql, { $inventoryId: inventoryId, $currentInventoryId: inventoryId }))
          .then(_ => db.exec("update inventory set closed = true where id = ?", [ inventoryId ]))
          .then(_ => db.exec("delete from currentinventory where inventoryId = ?", [ inventoryId ]))
          .then(_ => db.exec("commit"))
          .catch(err => {
            console.log(err)
            return db.exec("rollback")
          })
      }
      function createInventory() {
        return Promise.resolve()
          .then(_ => db.exec("begin"))
          .then(_ => db.exec("insert into inventory(responsibleStaffId) values(?)", [ responsibleStaffId ]))
          .then(_ => db.selectOne("select id as createdInventoryId from inventory where id in (select max(id) from inventory)"))
          .then(({ createdInventoryId }) => {
            return db.exec(closeInventorySql, { $inventoryId: -1, $createdInventoryId: createdInventoryId })
              .then(_ => db.exec("update inventory set closed = true where id = ?", [ createdInventoryId ]))
              .then(_ => db.exec("delete from currentinventory where inventoryId = -1"))
          })
          .then(_ => db.exec("commit"))
          .catch(err => {
            console.log(err)
            return db.exec("rollback")
          })
      }
      if (inventoryId < 0) {
        return createInventory()
      } else {
        return updateInventory()
      }
    },
    exportAllToExcel: (file, header) => {
      return db.select(selectProductBySearchSql, {
          $barcode: "",
          $key0   : "",
          $key1   : "",
          $key2   : "",
          $limit  : 99999999,
          $offset : 0,
        })
        .then(items => {
          const hdr = header.map(x => [[ x ]])
          const data = hdr
            .concat(
              [[ "Товар", "Бренд", "Штрихкод", "Категория", "Полка", "Остаток", "Ед.изм", "Цена продажи" ]]
            ).concat(
              items.map(item => [
                item.title,
                item.brand,
                item.barcode,
                item.categoryTitle,
                item.coord,
                item.quantity,
                item.unitNotation,
                item.price,
              ])
            )
          const wb = X.utils.book_new()
          const ws = {
            ...(X.utils.aoa_to_sheet(data)),
            "!ref": `A1:I${data.length+1}`,
            "!merges": hdr.map((h, idx) => ({
              s: {c: 0, r: idx},
              e: {c: 8, r: idx},
            }))
          }
          X.utils.book_append_sheet(wb, ws, "Описания товаров")
          X.writeFile(wb, file.path);
        })
    },
  }
}
