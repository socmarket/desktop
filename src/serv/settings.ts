export interface SettingsState {
  items: Array,
}

const SettingsActions = {
};

function SettingsReducer (state: SettingsState = {
  items: [],
}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export { SettingsActions, SettingsReducer };
