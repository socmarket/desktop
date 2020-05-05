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

function updateUnit(unit) {
  return function (dispatch, getState, { db }) {
    db.select("update unit set title=$title, notation=$notation where id=$id", {
      $id: unit.id,
      $title: unit.title,
      $notation: unit.notation,
    })
    .then(_ => {
      return db.select("select * from unit")
        .then(rows => dispatch(unitListUpdated(rows)))
    })
  };
}

function addUnit(unit) {
  return function (dispatch, getState, { db }) {
    db.select("insert into unit(title, notation) values('', '')")
    .then(_ => {
      return db.select("select * from unit")
        .then(rows => dispatch(unitListUpdated(rows)))
    })
  };
}

const UnitActions = {

  loadUnitList: () => {
    return function (dispatch, getState, { db }) {
      db.select("select * from unit")
        .then(rows => dispatch(unitListUpdated(rows)))
    };
  },

  updateUnit: updateUnit,
  addUnit: addUnit,

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
        text: row.notation,
      }));
      return Object.assign({}, state, { items: action.rows, selectOptions: selectOptions });
    default:
      return state
  }
}

export { UnitActions, UnitReducer };
