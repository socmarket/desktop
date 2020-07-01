import selectProductByIdSql            from "./sql/product/selectProductById.sql"
import selectProductBySearchSql        from "./sql/product/selectProductBySearch.sql"
import selectUnusedBarcodeSql          from "./sql/product/selectUnusedBarcode.sql"
import insertBarcodeSql                from "./sql/product/insertBarcode.sql"
import selectProductWithSameBarcodeSql from "./sql/product/selectProductWithSameBarcode.sql"
import insertProductSql                from "./sql/product/insertProduct.sql"
import updateProductSql                from "./sql/product/updateProduct.sql"

import path from "path"
import xlsx from "xlsx"

import { traverseF, ifF, ifNotF } from "../../util"

const { dialog } = require("electron").remote

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

export interface ProductApi {
  pick(id: number): Promise<Product>
  find(pattern: string): Promise<Product[]>
  find(id: number, barcode: string): Promise<Product>
  genBarcode(prefix: string): Promise<string>
  selectProductWithSameBarcode(barcode: string, id: string): Promise<Product[]>
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
    serialC   : col.serial   ? col.serial   : false,
    barcodeC  : col.barcode  ? col.barcode  : false,
    priceC    : col.price    ? col.price    : false,
    quantityC : col.quantity ? col.quantity : false,
  }
}

function getR(sheet, col, r) {
  const $title       = col.titleC  ? String(getV(sheet, col.titleC , r)) : ""
  const $model       = col.modelC  ? String(getV(sheet, col.modelC , r)) : ""
  const $engine      = col.engineC ? String(getV(sheet, col.engineC, r)) : ""
  const $brand       = col.brandC  ? String(getV(sheet, col.brandC , r)) : ""
  const $oemNo       = col.oemNoC  ? String(getV(sheet, col.oemNoC , r)) : ""
  const $serial      = col.serialC ? String(getV(sheet, col.serialC, r)) : ""

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
    , $oemNo       : $oemNo
    , $serial      : $serial
  }
}

async function productExistsF(db, row) {
  const p = await db.selectOne(
    "select id from product where title = $title and model = $model and engine = $engine and brand = $brand",
    {
      $title : row.$title,
      $model : row.$model,
      $engine: row.$engine,
      $brand : row.$brand,
    }
  )
  return Boolean(p)
}

export default function initProductApi(db: Database): ProductApi {
  return {
    pick: (id: number) => db.selectOne<Product>(selectProductByIdSql, { $productId: id }),
    find: (patternRaw: string) => {
      const pattern = patternRaw.toLowerCase().trim()
      const key = pattern.split(" ").concat([ "", "", "" ])
      return db.select<Product>(selectProductBySearchSql, {
        $barcode: patternRaw,
        $key0: key[0],
        $key1: key[1],
        $key2: key[2],
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
    importProducts: (args) => {
      const { barcodePrefix, sheet, excludedRows, rect, target, unitId, categoryId, currencyId, onRowDone } = args
      const importCols = getC(target)
      if (importCols.price)
      return db.exec("begin")
        .then(() => console.log("Import started"))
        .then(_ => traverseF(rect.rows, (ridx) => {
          const row = getR(sheet, importCol, ridx)
          if (!excludedRows.includes(ridx)) {
            return ifNotF(productExistsF(db, row), _ =>
              genBarcode(db, barcodePrefix)
                .then(barcode =>
                  db.exec(insertProductSql, {
                    $barcode       : barcode,
                    $unitId        : unitId,
                    $categoryId    : categoryId,
                    $notes         : "",
                    $notesLower    : "",
                    ...row
                  })
                )
                .then(_ => onRowDone(ridx, row))
            )
          }
        }))
        .then(_ => db.exec("commit"))
        .catch(err =>
          db.exec("rollback")
          .then(function(){ throw err; })
        )
    },
    chooseFile: () => {
      const filesPromise = dialog.showOpenDialog({
        title: "Выберите файл",
        filters: [{
          name: "Табличные файлы",
          extensions: "xls|xlsx|xlsm|xlsb|xml|xlw|xlc|csv|txt|dif|sylk|slk|prn|ods|fods|uos|dbf|wks|123|wq1|qpw|htm|html".split("|")
        }],
        properties: ['openFile']
      })
      return filesPromise.then(result => {
        if (!result.cancelled && result.filePaths.length > 0) {
          return Promise.resolve({
            filePath: result.filePaths[0],
            fileName: path.basename(result.filePaths[0]),
            wb: xlsx.readFile(result.filePaths[0]),
          })
        } else {
          return Promise.resolve()
        }
      })
    }
  }
}
