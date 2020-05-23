import createNewBarcode from "./sql/createNewBarcode.sql"
import selectUnusedBarcode from "./sql/selectUnusedBarcode.sql"

export interface LabellerState {
  newBarcode: String,
}

const newBarcodeCreated = (barcode) => ({
  type: "LABELLER_NEW_BARCODE_CREATED",
  barcode: barcode,
});

const barcodeUsed = () => ({
  type: "LABELLER_BARCODE_USED",
});

const PREFIX = "SM";

function genBarcode() {
  return function (dispatch, getState, { db }) {
    return db.selectOne(selectUnusedBarcode, { $prefix: PREFIX })
      .then(row => {
        if (row) {
          dispatch(newBarcodeCreated(row.barcode));
        } else {
          return db.exec(createNewBarcode)
            .then(_ => db.selectOne(selectUnusedBarcode, { $prefix: PREFIX }))
            .then(row => {
              dispatch(newBarcodeCreated(row.barcode));
            });
        }
      })
  };
}

function useBarcode() {
  return function (dispatch, getState, { db }) {
    dispatch(barcodeUsed());
  };
}

const LabellerActions = {
  genBarcode: genBarcode,
  useBarcode: useBarcode,
};

function LabellerReducer (state: LabellerState = {
  newBarcode: "",
}, action) {
  switch (action.type) {
    case "LABELLER_NEW_BARCODE_CREATED":
      return Object.assign({}, state, {
        newBarcode: action.barcode,
      });
    case "LABELLER_BARCODE_USED":
      return Object.assign({}, state, {
        newBarcode: "",
      });
    default:
      return state;
  }
}

export { LabellerActions, LabellerReducer };
