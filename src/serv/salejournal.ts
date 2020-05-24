import selectSaleCheckList from "./sql/selectSaleCheckList.sql"
import selectSaleCheckItemsFor from "./sql/selectSaleCheckItemsFor.sql"

export interface SaleJournalState {
  items: Array
}

const updateSaleJournal = (items) => ({
  type: "SALE_JOURNAL_UPDATE",
  items: items,
})

function reloadSaleJournal() {
  return function (dispatch, getState, { db }) {
    return db.select(selectSaleCheckList)
      .then(items =>
        Promise.all(
          items.map(saleCheck => new Promise((resolve, reject) => {
            db.select(selectSaleCheckItemsFor, { $saleCheckId: saleCheck.id })
              .then(items => {
                resolve({ ...saleCheck, items: items })
              })
              .catch(err => reject(err))
          }))
        )
      )
      .then(items => dispatch(updateSaleJournal(items)))
    ;
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
