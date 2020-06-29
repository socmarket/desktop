import upsertOptionSql from "./sql/settings/upsertOption.sql"

const defaultSettings = {
  appMode                           : "auto/parts",
  productLabelSize                  : "30x20",
  defaultClientId                   : 1,
  defaultSupplierId                 : 1,
  defaultCurrencyId                 : 1,
  defaultUnitId                     : 1,
  barcodePrefix                     : "Z",
  theme                             : "violet",
  defaultSaleMargin                 : 20,
  showConsignmentHistoryInSaleCheck : true,
}

function readSettings(rows) {
  const settings = rows.reduce((res, opt) => ({ [opt.key]: opt.value, ...res }), {})
  return {
    ...defaultSettings,
    ...settings,
  }
}

function setKey(db, key, value) {
  return db.exec(upsertOptionSql, { $key: key, $value: value })
}

export default function initSettingsApi(db) {
  return {
    getSettings: () => (
      db.select("select * from settings")
        .then(rows => readSettings(rows ? rows : []))
    ),
    changeTheme             : (themeName)  => setKey(db, "theme"            , themeName ),
    changeAppMode           : (appMode)    => setKey(db, "appMode"          , appMode   ),
    changeDefaultClient     : (clientId)   => setKey(db, "defaultClientId"  , clientId  ),
    changeDefaultSupplier   : (supplierId) => setKey(db, "defaultSupplierId", supplierId),
    changeDefaultUnit       : (unitId)     => setKey(db, "defaultUnitId"    , unitId    ),
    changeDefaultCurrency   : (currencyId) => setKey(db, "defaultCurrencyId", currencyId),
    changeBarcodePrefix     : (prefix)     => setKey(db, "barcodePrefix"    , prefix    ),
    changeDefaultSaleMargin : (margin)     => setKey(db, "defaultSaleMargin", margin    ),
    changeProductLabelSize  : (size)       => setKey(db, "productLabelSize" , size      ),
    changeShowConsignmentHistoryInSaleCheck : (boolFlag) => setKey(db, "showConsignmentHistoryInSaleCheck", boolFlag),
  }
}
