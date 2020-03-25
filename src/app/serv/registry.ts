import selectUnits from "./sql/registrySelectUnits.sql"
import selectCategories from "./sql/registrySelectCategories.sql"

export interface RegistryState {
  units: Array,
  unitSelect: Array,
  categories: Array,
  categoryOptions: Array
}

const registryUnitsReloaded = (rows) => ({
  type: "REGISTRY_UNITS_RELOADED",
  rows: rows
});

const registryCategoriesReloaded = (rows) => ({
  type: "REGISTRY_CATEGORIES_RELOADED",
  rows: rows
});

const RegistryActions = {

  reloadUnits: () => {
    return function (dispatch, getState, { db }) {
      db.select(selectUnits)
        .then(rows => dispatch(registryUnitsReloaded(rows)))
    };
  },

  reloadCategories: () => {
    return function (dispatch, getState, { db }) {
      db.select(selectCategories)
        .then(rows => dispatch(registryCategoriesReloaded(rows)))
    };
  },

}

function RegistryReducer (state: RegistryState = {
  units: [],
  unitOptions: [],
  categories: [],
  categoryOptions: [],
}, action) {
  switch (action.type) {
    case 'REGISTRY_UNITS_RELOADED': {
      const options = action.rows.map(row => ({
        key: row.id,
        value: row.id,
        text: row.notation,
      }));
      return Object.assign({}, state, { units: action.rows, unitOptions: options });
    }
    case 'REGISTRY_CATEGORIES_RELOADED': {
      const options = action.rows.map(row => ({
        key: row.id,
        value: row.id,
        text: row.title,
      }));
      return Object.assign({}, state, { categories: action.rows, categoryOptions: options });
    }
    default:
      return state
  }
}

export { RegistryActions, RegistryReducer };

