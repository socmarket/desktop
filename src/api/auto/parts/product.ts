import selectProductByIdSql            from "./sql/product/selectProductById.sql"
import selectProductBySearchSql        from "./sql/product/selectProductBySearch.sql"
import selectUnusedBarcodeSql          from "./sql/product/selectUnusedBarcode.sql"
import insertBarcodeSql                from "./sql/product/insertBarcode.sql"
import selectProductWithSameBarcodeSql from "./sql/product/selectProductWithSameBarcode.sql"
import insertProductSql                from "./sql/product/insertProduct.sql"
import updateProductSql                from "./sql/product/updateProduct.sql"
import selectIfProductExistsSql        from "./sql/product/selectIfProductExists.sql"
import importCurrentConsignmentItemSql from "./sql/product/importCurrentConsignmentItem.sql"
import selectImportedProductSql        from "./sql/product/selectImportedProduct.sql"
import insertConsignmentPriceSql       from "./sql/product/insertConsignmentPrice.sql"
import selectProductFlowSql            from "./sql/product/selectProductFlow.sql"
import insertImportInfoSql             from "./sql/product/insertImportInfo.sql"
import selectImportHistorySql          from "./sql/product/selectImportHistory.sql"
import selectProductsForExportSql      from "./sql/product/selectProductsForExport.sql"

import path from "path"
import X from "xlsx"

import { traverseF, ifF, ifNotF } from "../../util"


const nameH = [
  "наимен",
  "азвани",
]


export interface Product {
  id: number
  title: string
  barcode: string
  unitTitle: string
  categoryTitle: string
  unitId: number
  categoryId: number
  quantity: number
}

function genBarcode(db, prefix) {
  return db.selectOne(selectUnusedBarcodeSql, { $prefix: prefix })
    .then(row => {
      if (row) {
        return row.barcode
      } else {
        return db.exec(insertBarcodeSql)
          .then(_ => db.selectOne(selectUnusedBarcodeSql, { $prefix: prefix }))
          .then(row => row.barcode)
      }
    })
}

function getV(sheet, col, row) {
  if (sheet[col + row]) {
    return sheet[col + row].v
  } else {
    return ""
  }
}

function getC(target) {
  var col = {}
  target.forEach(t => { col[t.key] = t.col })
  return {
    titleC    : col.title    ? col.title    : false,
    modelC    : col.model    ? col.model    : false,
    engineC   : col.engine   ? col.engine   : false,
    brandC    : col.brand    ? col.brand    : false,
    oemNoC    : col.oemNo    ? col.oemNo    : false,
    barcodeC  : col.barcode  ? col.barcode  : false,
    priceC    : col.price    ? col.price    : false,
    quantityC : col.quantity ? col.quantity : false,
    barcodeC  : col.barcode  ? col.barcode  : false,
    serialC   : col.serial   ? col.serial   : false,
    coordC    : col.coord    ? col.coord    : false,
  }
}

function getR(sheet, col, r, brand) {
  const $title       = col.titleC    ? String(getV(sheet, col.titleC , r))   : ""
  const $model       = col.modelC    ? String(getV(sheet, col.modelC , r))   : ""
  const $engine      = col.engineC   ? String(getV(sheet, col.engineC, r))   : ""
  const $brand       = col.brandC    ? String(getV(sheet, col.brandC , r))   : brand
  const $oemNo       = col.oemNoC    ? String(getV(sheet, col.oemNoC , r))   : ""
  const $barcode     = col.barcodeC  ? String(getV(sheet, col.barcodeC, r))  : ""
  const $serial      = col.serialC   ? String(getV(sheet, col.serialC, r))   : ""
  const $coord       = col.coordC    ? String(getV(sheet, col.coordC, r))    : ""
  const $price       = col.priceC    ? Number(getV(sheet, col.priceC, r))    : ""
  const $quantity    = col.quantityC ? Number(getV(sheet, col.quantityC, r)) : ""

  const $titleLower  = $title  ? $title.toLowerCase()  : ""
  const $modelLower  = $model  ? $model.toLowerCase()  : ""
  const $engineLower = $engine ? $engine.toLowerCase() : ""
  const $brandLower  = $brand  ? $brand.toLowerCase()  : ""

  return {
    $title         : $title
    , $titleLower  : $titleLower
    , $model       : $model
    , $modelLower  : $modelLower
    , $engine      : $engine
    , $engineLower : $engineLower
    , $brand       : $brand
    , $brandLower  : $brandLower
    , $oemNo       : $oemNo.trim()
    , $barcode     : $barcode.trim()
    , $serial      : $serial
    , $coord       : $coord
    , $price       : $price
    , $quantity    : $quantity
  }
}

async function productExistsF(db, row) {
  const p = await db.selectOne(
    selectIfProductExistsSql,
    {
      $title   : row.$title,
      $brand   : row.$brand,
      $oemNo   : row.$oemNo,
      $barcode : row.$barcode,
    }
  )
  return Boolean(p)
}

async function importConsignment(db, item) {
  return db.selectOne(selectImportedProductSql, {
      $oemNo   : item.$oemNo,
      $barcode : item.$barcode,
    })
    .then(product => {
      if (product) {
        return db.exec(importCurrentConsignmentItemSql, {
          $productId  : product.id,
          $quantity   : item.$quantity,
          $price      : item.$price,
          $unitId     : product.unitId,
          $currencyId : item.$currencyId,
        })
      } else {
        console.log("product not found: ", item)
        Promise.resolve()
      }
    })
}

async function importConsignmentPrice(db, item) {
  return db.selectOne(selectImportedProductSql, {
      $oemNo   : item.$oemNo,
      $barcode : item.$barcode,
      $brand   : item.$brand,
    })
    .then(product => {
      if (product) {
        return db.exec(insertConsignmentPriceSql, {
          $productId  : product.id,
          $price      : item.$price,
          $currencyId : item.$currencyId,
        })
      } else {
        console.log("product not found: ", item)
        Promise.resolve()
      }
    })
}

export default function initProductApi(db) {
  return {
    pick: (id: number) => db.selectOne<Product>(selectProductByIdSql, { $productId: id }),
    find: (patternRaw, limit = 50, offset = 0) => {
      const pattern = patternRaw.toLowerCase().trim()
      const key = pattern.split(" ").concat([ "", "", "" ])
      return db.select(selectProductBySearchSql, {
        $barcode: patternRaw,
        $key0   : key[0],
        $key1   : key[1],
        $key2   : key[2],
        $limit  : limit,
        $offset : offset,
      })
    },
    select: ({ id, barcode }) => {
      if (id && id > 0) {
        return db.selectOne("select * from product where id = ?", [ id ])
      } else if (barcode && barcode.length > 0) {
        return db.selectOne("select * from product where barcode = $barcode or barcodes like '%' || $barcode || '%'", { $barcode: barcode })
      } else {
        return Promise.resolve()
      }
    },
    upsert: (product) => {
      const p = {
        $barcode       : product.barcode
        , $unitId      : product.unitId
        , $categoryId  : product.categoryId
        , $title       : product.title
        , $titleLower  : product.title.toLowerCase()
        , $brand       : product.brand || ""
        , $brandLower  : (product.brand ? product.brand.toLowerCase() : "")
        , $notes       : product.notes || ""
        , $notesLower  : (product.notes ? product.notes.toLowerCase() : "")
        , $model       : product.model || ""
        , $modelLower  : (product.model ? product.model.toLowerCase() : "")
        , $engine      : product.engine || ""
        , $engineLower : (product.engine ? product.engine.toLowerCase() : "")
        , $oemNo       : product.oemNo || ""
        , $serial      : product.serial || ""
        , $coord       : product.coord || ""
      }
      if (product.id < 0) {
        return db.exec(insertProductSql, p)
      } else {
        return db.exec(updateProductSql, { $id: product.id, ...p })
      }
    },
    genBarcode: (prefix = "Z") => genBarcode(db, prefix),
    selectProductWithSameBarcode: (barcode, id) => {
      return db.selectOne(selectProductWithSameBarcodeSql, { $barcode: barcode, $id: id })
    },
    selectProductFlow: (productId) => db.select(selectProductFlowSql, { $productId: productId }),
    openFile: (filePath) => Promise.resolve(X.readFile(filePath)),
    importProducts: async (args) => {
      const {
        file, barcodePrefix, sheet, excludedRows,
        rect, target, unitId, categoryId, currencyId,
        targetCurrencyId, brand, onRowDone
      } = args
      const importCols = getC(target)
      var priceRatio = 1
      var importedCount = 0
      if (importCols.priceC) {
        await db.selectOne(
          "select rate from exchangerate where fromCurrencyId = ? and toCurrencyId = ? order by updatedAt desc limit 1",
          [ currencyId, targetCurrencyId ]
        ).then(row => {
          if (row)
            priceRatio = row.rate
        })
      }
      return db.exec("begin")
        .then(_ => traverseF(rect.rows, async (ridx) => {
          if (excludedRows.includes(ridx))
            return Promise.resolve()
          const row = getR(sheet, importCols, ridx, brand)
          if (
            (importCols.barcodeC && row.$barcode.length === 0) ||
            (importCols.oemNoC && !importCols.barcodeC && row.$oemNo.length === 0) ||
            (nameH.filter(x => row.$title.toLowerCase().includes(x)).length > 0) ||
            (importCols.priceC && !row.$price)
          )
            return Promise.resolve()
          let done = false;
          const productExists = await productExistsF(db, row)
          const barcode = importCols.barcodeC ? row.$barcode : await genBarcode(db, barcodePrefix);
          const item = {
            ...row,
            $barcode    : barcode,
            $unitId     : unitId,
            $categoryId : categoryId,
            $notes      : file.name,
            $notesLower : file.name.toLowerCase(),
          }
          if (!productExists && importCols.titleC && item.$title.length > 0) {
            const { $price, $quantity, ...product } = item
            await db.exec(insertProductSql, product)
            done = true
          } else {
            console.log("miss: ", item)
          }
          if (importCols.priceC) {
            await importConsignmentPrice(db, {
              ...item,
              $price      : item.$price * priceRatio,
              $currencyId : targetCurrencyId,
            })
            done = true
          }
          if (importCols.quantityC && importCols.priceC) {
            await importConsignment(db, {
              ...item,
              $price      : item.$price * priceRatio,
              $currencyId : targetCurrencyId,
            })
            done = true
          }
          if (done) {
            importedCount += 1
            onRowDone(ridx, item)
          }
          return Promise.resolve()
        }))
        .then(_ => db.exec(insertImportInfoSql, {
          $fileDir       : file.dir,
          $filePath      : file.path,
          $fileName      : file.name,
          $fields        : target.map(x => `${x.col}:${x.key}:${x.title}`).join(","),
          $rowCount      : rect.rows.length - excludedRows.length,
          $importedCount : importedCount,
          $unitId        : unitId,
          $categoryId    : categoryId,
          $currencyId    : currencyId,
        }))
        .then(_ => db.exec("commit"))
        .catch(err =>
          db.exec("rollback")
          .then(function(){ throw err; })
        )
    },
    exportAllToExcel: (file, header) => {
      return db.select(selectProductsForExportSql)
        .then(items => {
          const hdr = header.map(x => [[ x ]])
          const data = hdr
            .concat(
              [[ "Товар", "Бренд", "Штрихкод", "OEM", "Серийник", "Модель", "Движок", "Категория", "Полка" ]]
            ).concat(
              items.map(item => [
                item.title,
                item.brand,
                item.barcode,
                item.oemNo,
                item.serial,
                item.model,
                item.engine,
                item.categoryTitle,
                item.coord,
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
    selectImportHistory: () => db.select(selectImportHistorySql),
  }
}
