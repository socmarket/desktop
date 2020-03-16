export interface CounterState {
  value: int
  started: boolean
}

const CounterActions = {
  inc: () => ({
    type: 'COUNTER_INC',
    payload: {}
  }),

  dec: () => ({
    type: 'COUNTER_DEC',
    payload: {}
  }),

  start: () => {
    return {
      types: [
        "COUNTER_BEFORE_START",
        "COUNTER_START",
        "COUNTER_START_FAILED",
      ]
      , promise: (store) => {
        return new Promise((resolve) => {
          const id = setInterval(() => {
            store.dispatch({
              type: "COUNTER_INC"
            })
          }, 1000)
          setTimeout(() => resolve({ timerId: id }), 0)
        })
      }
    }
  },

  stop: () => {
    return {
      types: [
        "COUNTER_BEFORE_STOP",
        "COUNTER_STOP",
        "COUNTER_STOP_FAILED",
      ]
      , promise: (store) => {
        return new Promise((resolve) => {
          const { counter } = store.getState();
          setTimeout(() => {
            clearInterval(counter.timerId);
            resolve({});
          }, 0)
        })
      }
    }
  }
}

function CounterReducer (state = { value: 0, started: false, timerId: -1 }, action) {
  switch (action.type) {
    case 'COUNTER_INC':
      return Object.assign({}, state, { value: state.value + 1 });
    case 'COUNTER_DEC':
      return Object.assign({}, state, { value: state.value - 1 });
    case 'COUNTER_START':
      return Object.assign({}, state, { started: true, timerId: action.data.timerId });
    case 'COUNTER_STOP':
      return Object.assign({}, state, { started: false, timerId: -1 });
    default:
      return state
  }
}

export { CounterActions, CounterReducer };
