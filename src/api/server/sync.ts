import selectTokenSql           from "./sql/sync/selectToken.sql"
import selectUnitSql            from "./sql/sync/selectUnit.sql"
import selectCurrencySql        from "./sql/sync/selectCurrency.sql"
import selectClientSql          from "./sql/sync/selectClient.sql"
import selectSupplierSql        from "./sql/sync/selectSupplier.sql"
import selectCategorySql        from "./sql/sync/selectCategory.sql"
import selectSettingSql         from "./sql/sync/selectSetting.sql"
import selectBarcodeSql         from "./sql/sync/selectBarcode.sql"
import selectProductSql         from "./sql/sync/selectProduct.sql"
import selectPriceSql           from "./sql/sync/selectPrice.sql"
import selectSaleCheckSql       from "./sql/sync/selectSaleCheck.sql"
import selectSaleCheckItemSql   from "./sql/sync/selectSaleCheckItem.sql"
import selectConsignmentSql     from "./sql/sync/selectConsignment.sql"
import selectConsignmentItemSql from "./sql/sync/selectConsignmentItem.sql"
import selectSaleCheckRetSql    from "./sql/sync/selectSaleCheckRet.sql"
import selectConsignmentRetSql  from "./sql/sync/selectConsignmentRet.sql"

import { traverseF } from "../util"

function syncEntitySetup(axios, db, batchSize) {
  return async function (entity, selectSql) {
    const tokenRow = await db.selectOne(selectTokenSql)
    if (tokenRow) {
      const authHeader = { headers: { Authorization: `Bearer ${tokenRow.token}` } }
      const items = await db.select(selectSql, { $limit: batchSize })
      if (items && items.length > 0) {
        await axios.post(`/api/sync/${entity}`, items, authHeader)
        await db.bulk(`insert into sync(id, entity) values($id, $entity)`, items.map(item => ({ $id: item.id, $entity: entity })))
      }
      return items.length
    } else {
      return 0
    }
  }
}

async function* createStep(axios, db, batchSize) {
  const syncEntity = syncEntitySetup(axios, db, batchSize)
  const steps = [
    () => syncEntity("unit"           , selectUnitSql),
    () => syncEntity("currency"       , selectCurrencySql),
    () => syncEntity("client"         , selectClientSql),
    () => syncEntity("supplier"       , selectSupplierSql),
    () => syncEntity("category"       , selectCategorySql),
    () => syncEntity("setting"        , selectSettingSql),
    () => syncEntity("barcode"        , selectBarcodeSql),
    () => syncEntity("product"        , selectProductSql),
    () => syncEntity("price"          , selectPriceSql),
    () => syncEntity("salecheck"      , selectSaleCheckSql),
    () => syncEntity("salecheckitem"  , selectSaleCheckItemSql),
    () => syncEntity("consignment"    , selectConsignmentSql),
    () => syncEntity("consignmentitem", selectConsignmentItemSql),
    () => syncEntity("salecheckret"   , selectSaleCheckRetSql),
    () => syncEntity("consignmentret" , selectConsignmentRetSql),
  ]
  let count = 0
  while (true) {
    count = 0
    for (let i = 0; i < steps.length; ++i) {
      count += await (steps[i]().catch(err => {
        console.error(err)
        return 0
      }))
      yield "next"
    }
    if (count > 0) {
      yield "next"
    } else {
      yield "pause"
    }
  }
}

export default function initSyncApi(axios, db) {
  const nextSyncDelay = 60000
  const stepDelay = 300
  const batchSize = 50

  var tickerId = 0

  const step = createStep(axios, db, batchSize)
  const loop = (delay) => {
    clearTimeout(tickerId)
    tickerId = setTimeout(() => {
      step
        .next()
        .then(res => {
          if (res.value === "pause") {
            loop(nextSyncDelay)
          } else {
            loop(stepDelay)
          }
        })
        .catch(err => {
          loop(nextSyncDelay)
        })
    }, delay)
  }

  return {
    resume: () => {
      loop(stepDelay)
    },
    pause: () => {
      clearTimeout(tickerId)
    },
  }
}
