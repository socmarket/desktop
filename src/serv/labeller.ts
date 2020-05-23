import labelProg from "./tspl/label.tspl"
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
    const code = labelProg
      .replace("__BARCODE__", barcode)
      .replace("__LABEL__", tr(label))
      .replace("__COUNT__", count)
    ;
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

const LabellerActions = {
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
    default:
      return state;
  }
}

export { LabellerActions, LabellerReducer };
