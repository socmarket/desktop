export interface Unit {
  id: int;
  title: string;
}

export interface UnitState {
  items: Array[Unit];
  selectOptions: Array[{ key: string, value: int, text: string }];
}

const unitListUpdated = (rows) => ({
  type: "UNIT_LIST_UPDATED",
  rows: rows
});

const UnitActions = {

  loadUnitList: () => {
    return function (dispatch, getState, { db }) {
      db.select("select * from unit")
        .then(rows => dispatch(unitListUpdated(rows)))
    };
  },

}

function UnitReducer (state: UnitState = {
  items: [],
  selectOptions: [],
}, action) {
  switch (action.type) {
    case 'UNIT_LIST_UPDATED':
      const selectOptions = action.rows.map(row => ({
        key: row.id,
        value: row.id,
        text: row.title,
      }));
      return Object.assign({}, state, { items: action.rows, selectOptions: selectOptions });
    default:
      return state
  }
}

export { UnitActions, UnitReducer };
