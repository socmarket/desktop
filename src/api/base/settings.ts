import upsertOptionSql from "./sql/settings/upsertOption.sql"

const defaultSettings = {
  appMode                           : "auto/parts",
  productLabelSize                  : "30x20",
  defaultClientId                   : 1,
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
    changeTheme: (themeName) => setKey(db, "theme", themeName)
  }
}
