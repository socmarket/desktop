import { RegistryActions } from "./registry"

import selectBalanceByIdSql from "./sql/client/selectBalanceById.sql"

export interface Client {
  id: int;
  name: string;
  contacts: string;
  notes: string;
}

export interface ClientState {
  items: Array;
  filterPattern: string;
  showForm: boolean;
  balance: object;
}

const clientListUpdated = (pattern, rows) => ({
  type: "CLIENT_LIST_UPDATED",
  rows: rows,
  pattern: pattern
});

const currentClientUpdated = (client) => ({
  type: "CLIENT_FORM_UPDATED",
  client: client
});

const balanceUpdated = (items) => ({
  type: "CLIENT_BALANCE_UPDATED",
  items: items
});


function setClientListFilter(pattern) {
  return (dispatch, getState, { db }) => {
    db.select("select * from client where (nameLower like ?)", [ "%" + pattern.toLowerCase() + "%" ])
      .then(rows => dispatch(clientListUpdated(pattern, rows)))
  };
}

function createClient(client: Client) {
  return function (dispatch, getState, { db }) {
    const { client: { filterPattern } } = getState();
    db.exec("insert into client(name, nameLower, contacts, notes) values(?, ?, ?, ?)",
      [
        client.name,
        client.name.toLowerCase(),
        client.contacts,
        client.notes,
      ], {
        client: client
      }
    )
      .then(_ => dispatch(RegistryActions.reloadClients()))
      .then(_ => setClientListFilter(filterPattern)(dispatch, getState, { db }))
  };
}

function updateClient(client) {
  return function (dispatch, getState, { db }) {
    const { client: { filterPattern } } = getState();
    db.exec("update client set name = $name, nameLower = $nameLower, contacts = $contacts, notes = $notes where id = $id",
      {
        $name: client.name,
        $nameLower: client.name.toLowerCase(),
        $contacts: client.contacts,
        $notes: client.notes,
        $id: client.id
      }, {
        client: client
      }
    )
      .then(_ => dispatch(RegistryActions.reloadClients()))
      .then(_ => setClientListFilter(filterPattern)(dispatch, getState, { db }))
  };
}

function reloadBalance(clientId) {
  return function (dispatch, getState, { db }) {
    return db.select(selectBalanceByIdSql, { $clientId: clientId })
      .then(rows => dispatch(balanceUpdated(rows)))
    ;
  };
}

function addBalanceItem(clientId, amount) {
  return function (dispatch, getState, { db }) {
    return db.exec("insert into clientbalance(clientId, amount) values(?, ?)", [
      clientId,
      Math.round(amount * 100),
    ])
      .then(_ => reloadBalance(clientId)(dispatch, getState, { db: db }))
    ;
  };
}

const ClientActions = {
  showClientForm: () => ({
    type: 'CLIENT_SHOW_FORM'
  }),
  hideClientForm: () => ({
    type: 'CLIENT_HIDE_FORM'
  }),
  createClient: createClient,
  updateClient: updateClient,
  setClientListFilter: setClientListFilter,
  reloadBalance: reloadBalance,
  addBalanceItem: addBalanceItem,
}

function ClientReducer (state: ClientState = {
  items: [],
  filterPattern: "",
  showForm: true,
  balance: {
    items: [],
    total: 0,
  }
}, action) {
  switch (action.type) {
    case 'CLIENT_LIST_UPDATED':
      return Object.assign({}, state, { items: action.rows, filterPattern: action.pattern });
    case 'CLIENT_SHOW_FORM':
      return Object.assign({}, state, { showForm: true });
    case 'CLIENT_HIDE_FORM':
      return Object.assign({}, state, { showForm: false });
    case 'CLIENT_BALANCE_UPDATED': {
      const items = action.items;
      const debit  = items.length > 0 ? items.map(a => a.debit ).reduce((a, b) => (a + b), 0) : 0;
      const credit = items.length > 0 ? items.map(a => a.credit).reduce((a, b) => (a + b), 0) : 0;
      return Object.assign({}, state, {
        balance: {
          items: action.items,
          total: debit - credit,
        }
      });
    }
    default:
      return state
  }
}

export { ClientActions, ClientReducer };
