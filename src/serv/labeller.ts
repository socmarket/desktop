import labelProg from "./tspl/label.tspl"
import labelCompactX3 from "./tspl/labelCompactX3.tspl"
import createNewBarcode from "./sql/createNewBarcode.sql"
import selectUnusedBarcode from "./sql/selectUnusedBarcode.sql"

import { transliterate as tr } from 'transliteration';

export interface LabellerState {
  newBarcode: String;
  errorMsg: String;
}

const newBarcodeCreated = (barcode) => ({
  type: "LABELLER_NEW_BARCODE_CREATED",
  barcode: barcode,
});

const labellerFailed = (errorMsg) => ({
  type: "LABELLER_FAILED",
  errorMsg: errorMsg,
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

function printLabel(barcode, label, count = 1) {
  return function (dispatch, getState, { db, usb }) {
    const { printer } = getState();
    const code = labelCompactX3
      .replace(/__BARCODE__/g, barcode)
      .replace(/__LABEL__/g, tr(label.substring(0, 25)))
      .replace(/__COUNT__/g, count)
    ;
    console.log(code);
    if (printer.vid > 0 && printer.pid > 0) {
      if (barcode.length > 0 && label.length > 0) {
        usb.open(printer.vid, printer.pid)
          .then(_ => usb.write(code))
          .then(_ => usb.close())
          .then(_ => {
            dispatch(labellerFailed(""));
          })
          .catch(err => {
            dispatch(labellerFailed("Ошибка печати."));
            console.log(err);
          })
        ;
      } else {
        dispatch(labellerFailed("Товар не выбран или не зарегистрирован."));
      }
    } else {
      dispatch(labellerFailed("Принтер не выбран. Выберите принтер в настройках."));
    }
  };
}

function useBarcode () {
  return function (dispatch, getState, { db }) {
    dispatch(barcodeUsed());
  };
}

const LabellerActions = {
  useBarcode: useBarcode,
  genBarcode: genBarcode,
  printLabel: printLabel,
};

function LabellerReducer (state: LabellerState = {
  newBarcode: "",
  errorMsg: "",
}, action) {
  switch (action.type) {
    case "LABELLER_NEW_BARCODE_CREATED":
      return Object.assign({}, state, {
        newBarcode: action.barcode,
        errorMsg: "",
      });
    case "LABELLER_BARCODE_USED":
      return Object.assign({}, state, {
        newBarcode: "",
      });
    case "LABELLER_FAILED":
      return Object.assign({}, state, {
        errorMsg: action.errorMsg,
      });
    case "LABELLER_BARCODE_USED":
      return Object.assign({}, state, {
        errorMsg: "",
        newBarcode: "",
      });
    default:
      return state;
  }
}

export { LabellerActions, LabellerReducer };
