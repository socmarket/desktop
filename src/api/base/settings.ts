
const defaultSettings = {
  appMode          : "auto/parts",
  productLabelSize : "30x20", 
}

function readSettings(rows) {
  const settings = rows.reduce((res, opt) => ({ [opt.key]: opt.value, ...res }), {})
  return {
    ...defaultSettings,
    ...settings,
  }
}

export default function initSettingsApi(db) {
  return {
    getSettings: () => (
      db.select("select * from settings")
        .then(rows => readSettings(rows ? rows : []))
    )
  }
}
