
const evSettingsReloaded = (settings) => ({
  type: "SETTINGS_RELOADED",
  settings: settings,
})

const reloadSettings = () => (dispatch, getState, { api }) => {
  return api.settings
    .getSettings()
    .then(settings => dispatch(evSettingsReloaded(settings)))
}

const SettingsActions = {
  reloadSettings: reloadSettings,
}

function SettingsReducer (state = {
  settings: {},
}, action) {
  switch (action.type) {
    case "SETTINGS_RELOADED": {
      return Object.assign({}, state, {
        appMode         : action.settings.appMode,
        defaultClientId : action.settings.defaultClientId ? +action.settings.defaultClientId : -1,
      })
    }
    default:
      return state
  }
}

export { SettingsActions, SettingsReducer }
