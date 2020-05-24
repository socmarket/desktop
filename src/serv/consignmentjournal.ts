import selectConsignmentList from "./sql/selectConsignmentList.sql"
import selectConsignmentItemsFor from "./sql/selectConsignmentItemsFor.sql"

export interface ConsignmentJournalState {
  items: Array
}

const updateConsignmentJournal = (items) => ({
  type: "CONSIGNMENT_JOURNAL_UPDATE",
  items: items,
})

function reloadConsignmentJournal() {
  return function (dispatch, getState, { db }) {
    return db.select(selectConsignmentList)
      .then(items =>
        Promise.all(
          items.map(consignment => new Promise((resolve, reject) => {
            db.select(selectConsignmentItemsFor, { $consignmentId: consignment.id })
              .then(items => {
                resolve({ ...consignment, items: items })
              })
              .catch(err => reject(err))
          }))
        )
      )
      .then(items => dispatch(updateConsignmentJournal(items)))
    ;
  };
}

const ConsignmentJournalActions = {
  reloadConsignmentJournal: reloadConsignmentJournal,
};

function ConsignmentJournalReducer (state = {
  items: []
}, action) {
  switch (action.type) {
    case "CONSIGNMENT_JOURNAL_UPDATE": {
      return Object.assign({}, state, {
        items: action.items
      });
    }
    default:
      return state;
  }
}

export { ConsignmentJournalActions, ConsignmentJournalReducer };
