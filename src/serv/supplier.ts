import { RegistryActions } from "./registry"

export interface Supplier {
  id: int;
  name: string;
  contacts: string;
  notes: string;
}

export interface SupplierState {
  items: Array,
  filterPattern: string,
  showForm: boolean,
}

const supplierListUpdated = (pattern, rows) => ({
  type: "SUPPLIER_LIST_UPDATED",
  rows: rows,
  pattern: pattern
});

const currentSupplierUpdated = (supplier) => ({
  type: "SUPPLIER_FORM_UPDATED",
  supplier: supplier
});

function setSupplierListFilter(pattern) {
  return (dispatch, getState, { db }) => {
    db.select("select * from supplier where (name like ?)", [ "%" + pattern + "%" ], { pattern: pattern })
      .then(rows => dispatch(supplierListUpdated(pattern, rows)))
  };
}

function createSupplier(supplier: Supplier) {
  return function (dispatch, getState, { db }) {
    const { supplier: { filterPattern } } = getState();
    db.exec("insert into supplier(name, nameLower, contacts, notes) values(?, ?, ?, ?)",
      [
        supplier.name,
        supplier.name.toLowerCase(),
        supplier.contacts,
        supplier.notes,
      ], {
        supplier: supplier
      }
    )
      .then(_ => dispatch(RegistryActions.reloadSuppliers()))
      .then(_ => setSupplierListFilter(filterPattern)(dispatch, getState, { db }))
  };
}

function updateSupplier(supplier) {
  return function (dispatch, getState, { db }) {
    const { supplier: { filterPattern } } = getState();
    db.exec("update supplier set name = $name, nameLower = $nameLower, contacts = $contacts, notes = $notes where id = $id",
      {
        $name: supplier.name,
        $nameLower: supplier.name.toLowerCase(),
        $contacts: supplier.contacts,
        $notes: supplier.notes,
        $id: supplier.id
      }, {
        supplier: supplier
      }
    )
      .then(_ => dispatch(RegistryActions.reloadSuppliers()))
      .then(_ => setSupplierListFilter(filterPattern)(dispatch, getState, { db }))
  };
}

const SupplierActions = {
  showSupplierForm: () => ({
    type: 'SUPPLIER_SHOW_FORM'
  }),
  hideSupplierForm: () => ({
    type: 'SUPPLIER_HIDE_FORM'
  }),
  createSupplier: createSupplier,
  updateSupplier: updateSupplier,
  setSupplierListFilter: setSupplierListFilter,
}

function SupplierReducer (state: SupplierState = {
  items: [],
  filterPattern: "",
  showForm: true,
}, action) {
  switch (action.type) {
    case 'SUPPLIER_LIST_UPDATED':
      return Object.assign({}, state, { items: action.rows, filterPattern: action.pattern });
    case 'SUPPLIER_SHOW_FORM':
      return Object.assign({}, state, { showForm: true });
    case 'SUPPLIER_HIDE_FORM':
      return Object.assign({}, state, { showForm: false });
    default:
      return state
  }
}

export { SupplierActions, SupplierReducer };
