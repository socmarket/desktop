
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

const reloadSettings = () => (dispatch, getState, { api }) => {
  return api.settings
    .getSettings()
    .then(settings => dispatch(evSettingsReloaded(settings)))
}

const changeTheme = (themeName) => (dispatch, getState, { api }) => {
  return api.settings.changeTheme(themeName)
    .then(_ => dispatch(evThemeChanged(themeName)))
}
 

const SettingsActions = {
  reloadSettings: reloadSettings,
  changeTheme   : changeTheme,
}

function SettingsReducer (state = {
  themes: themes,
}, action) {
  switch (action.type) {
    case "SETTINGS_RELOADED": {
      return Object.assign({}, state, {
        appMode           : action.settings.appMode,
        defaultClientId   : action.settings.defaultClientId,
        defaultCurrencyId : action.settings.defaultCurrencyId,
        theme             : themes[action.settings.theme] ? themes[action.settings.theme] : themes["blue"],
      })
    }
    case "SETTINGS_THEME_CHANGED": {
      return Object.assign({}, state, {
        theme           : themes[action.themeName] ? themes[action.themeName] : themes["blue"],
      })
    }
    default:
      return state
  }
}

export { SettingsActions, SettingsReducer }
