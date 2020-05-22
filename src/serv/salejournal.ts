import selectSaleJournal from "./sql/selectSaleJournal.sql"

export interface SaleJournalState {
  items: Array
}

const updateSaleJournal = (items) => ({
  type: "SALE_JOURNAL_UPDATE",
  items: items,
})

function reloadSaleJournal() {
  return function (dispatch, getState, { db }) {
    return db.select(selectSaleJournal)
      .then(items => {
        dispatch(updateSaleJournal(items));
      })
  };
}

const SaleJournalActions = {
  reloadSaleJournal: reloadSaleJournal,
};

function SaleJournalReducer (state = {
  items: []
}, action) {
  switch (action.type) {
    case "SALE_JOURNAL_UPDATE": {
      return Object.assign({}, state, {
        items: action.items
      });
    }
    default:
      return state;
  }
}

export { SaleJournalActions, SaleJournalReducer };
