import { RegistryActions } from "./registry"

export interface Client {
  id: int;
  name: string;
  contacts: string;
  notes: string;
}

export interface ClientState {
  items: Array,
  filterPattern: string,
  showForm: boolean,
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

function setClientListFilter(pattern) {
  return (dispatch, getState, { db }) => {
    db.select("select * from client where (name like ?)", [ "%" + pattern + "%" ], { pattern: pattern })
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
}

function ClientReducer (state: ClientState = {
  items: [],
  filterPattern: "",
  showForm: true,
}, action) {
  switch (action.type) {
    case 'CLIENT_LIST_UPDATED':
      return Object.assign({}, state, { items: action.rows, filterPattern: action.pattern });
    case 'CLIENT_SHOW_FORM':
      return Object.assign({}, state, { showForm: true });
    case 'CLIENT_HIDE_FORM':
      return Object.assign({}, state, { showForm: false });
    default:
      return state
  }
}

export { ClientActions, ClientReducer };

