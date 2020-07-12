import upsertOptionSql from "./sql/settings/upsertOption.sql"

import sha256 from 'crypto-js/sha256';

const defaultSettings = {
  appMode                           : "auto/parts",
  defaultClientId                   : 1,
  defaultSupplierId                 : 1,
  defaultCurrencyId                 : 1,
  defaultUnitId                     : 1,
  defaultCategoryId                 : 1,
  barcodePrefix                     : "Z",
  theme                             : "violet",
  defaultSaleMargin                 : 20,
  showConsignmentHistoryInSaleCheck : true,

  cashierPinHash                    : false,
  managerPinHash                    : false,
  adminPinHash                      : false,

  productLabelSize                  : "30x20",
  productLabelOffsetX               : 4,
  labelPrinterId                    : "",

  logoLine1                         : "--=< SOCMARKET >=--",
  logoLine2                         : "TEL: 000 000 000",
  logoLine3                         : "SPASIBO ZA POKUPKU!",
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
    changeTheme               : (themeName)  => setKey(db, "theme"               , themeName ),
    changeAppMode             : (appMode)    => setKey(db, "appMode"             , appMode   ),
    changeDefaultClient       : (clientId)   => setKey(db, "defaultClientId"     , clientId  ),
    changeDefaultSupplier     : (supplierId) => setKey(db, "defaultSupplierId"   , supplierId),
    changeDefaultUnit         : (unitId)     => setKey(db, "defaultUnitId"       , unitId    ),
    changeDefaultCurrency     : (currencyId) => setKey(db, "defaultCurrencyId"   , currencyId),
    changeBarcodePrefix       : (prefix)     => setKey(db, "barcodePrefix"       , prefix    ),
    changeDefaultSaleMargin   : (margin)     => setKey(db, "defaultSaleMargin"   , margin    ),
    changeProductLabelSize    : (size)       => setKey(db, "productLabelSize"    , size      ),
    changeProductLabelOffsetX : (offsetX)    => setKey(db, "productLabelOffsetX" , offsetX   ),
    choosePrinter             : (id)         => setKey(db, "labelPrinterId"      , id        ),
    changeLogoLine            : (no, value)  => setKey(db, "logoLine" + no       , value     ),
    changeShowConsignmentHistoryInSaleCheck : (boolFlag) => setKey(db, "showConsignmentHistoryInSaleCheck", boolFlag),
    setUserPin : (user, pin) => {
      const hash = sha256(pin) + "";
      return setKey(db, user + "PinHash", hash)
    },
  }
}
