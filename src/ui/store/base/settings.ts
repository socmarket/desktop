import i18next from "i18next"

const languages = {
  "ru": {
    name : "ru"
  },
  "en": {
    name : "en"
  }
}
const themes = {
  "red": {
    name      : "red", 
    mainColor : "red",
  },
  "orange": {
    name      : "orange", 
    mainColor : "orange",
  },
  "yellow": {
    name      : "yellow", 
    mainColor : "yellow",
  },
  "olive": {
    name      : "olive", 
    mainColor : "olive",
  },
  "green": {
    name      : "green", 
    mainColor : "green",
  },
  "teal": {
    name      : "teal", 
    mainColor : "teal",
  },
  "blue": {
    name      : "blue", 
    mainColor : "blue",
  },
  "violet": {
    name      : "violet", 
    mainColor : "violet",
  },
  "purple": {
    name      : "purple", 
    mainColor : "purple",
  },
  "pink": {
    name      : "pink", 
    mainColor : "pink",
  },
  "brown": {
    name      : "brown", 
    mainColor : "brown",
  },
  "grey": {
    name      : "grey", 
    mainColor : "grey",
  },
  "black": {
    name      : "black", 
    mainColor : "black",
  },
}

const evSettingsReloaded = (settings) => ({
  type: "SETTINGS_RELOADED",
  settings: settings,
})

const evThemeChanged = (themeName) => ({
  type: "SETTINGS_THEME_CHANGED",
  themeName: themeName,
})

const evLanguageChanged = (language) => ({
  type: "SETTINGS_LANGUAGE_CHANGED",
  language: language
})

const reloadSettings = () => (dispatch, getState, { api }) => {
  return api.settings
    .getSettings()
    .then(settings => dispatch(evSettingsReloaded(settings)))
    .then(({ settings }) => i18next.changeLanguage(settings.language))
}

const changeTheme = (themeName) => (dispatch, getState, { api }) => {
  return api.settings.changeTheme(themeName)
    .then(_ => dispatch(evThemeChanged(themeName)))
}
 
const changeLanguage = (language) => (dispatch, getState, { api}) => {
  return i18next
    .changeLanguage(language)
    .then(_ => api.settings.changeLanguage(language))
    .then(_ => dispatch(evLanguageChanged(language)))
}

const SettingsActions = {
  reloadSettings: reloadSettings,
  changeTheme   : changeTheme,
  changeLanguage : changeLanguage,
}

function SettingsReducer (state = {
  themes: themes,
  languages: languages,
}, action) {
  switch (action.type) {
    case "SETTINGS_RELOADED": {
      return Object.assign({}, state, {
        appMode                           : action.settings.appMode,
        defaultClientId                   : action.settings.defaultClientId,
        defaultSupplierId                 : action.settings.defaultSupplierId,
        defaultCurrencyId                 : action.settings.defaultCurrencyId,
        defaultSaleMargin                 : action.settings.defaultSaleMargin,
        defaultUnitId                     : action.settings.defaultUnitId,
        defaultCategoryId                 : action.settings.defaultCategoryId,
        barcodePrefix                     : action.settings.barcodePrefix,
        cashierPinHash                    : action.settings.cashierPinHash,
        managerPinHash                    : action.settings.managerPinHash,
        adminPinHash                      : action.settings.adminPinHash,

        productLabelSize                  : action.settings.productLabelSize,
        productLabelOffsetX               : action.settings.productLabelOffsetX,
        labelPrinterId                    : action.settings.labelPrinterId,

        logoLine1                         : action.settings.logoLine1,
        logoLine2                         : action.settings.logoLine2,
        logoLine3                         : action.settings.logoLine3,

        theme                             : themes[action.settings.theme] ? themes[action.settings.theme] : themes["blue"],
        language                          : languages[action.settings.language] ? languages[action.settings.language] : languages["ru"],
        showConsignmentHistoryInSaleCheck : Boolean(+action.settings.showConsignmentHistoryInSaleCheck),
      })
    }
    case "SETTINGS_THEME_CHANGED": {
      return Object.assign({}, state, {
        theme           : themes[action.themeName] ? themes[action.themeName] : themes["blue"],
      })
    }
    case "SETTINGS_LANGUAGE_CHANGED": {
      return Object.assign({}, state, {
        language        : languages[action.language] ? languages[action.language] : languages["ru"],
      })
    }
    default:
      return state
  }
}

export { SettingsActions, SettingsReducer }
