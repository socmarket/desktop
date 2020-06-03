export interface SettingsState {
  items: Array,
}

function tryPromise() {
  return (dispatch, getState, { api, boo }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(dispatch({ type: "BOO", data: "OK" }));
      }, 1000);
    });
  };
}

const SettingsActions = {
  tryPromise: tryPromise
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
