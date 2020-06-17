import labelProg from "./tspl/label.tspl"
import labelCompactX3S60x40 from "./tspl/labelCompactX3S60x40.tspl"
import labelCompactX2MultilineS60x40 from "./tspl/labelCompactX2MultilineS60x40.tspl"
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
    var code = ""
    if (label.length > 18) {
      const lbl = label.match(/.{1,18}/g)
      while (lbl.length < 3) lbl.push("");
      code = labelCompactX2MultilineS60x40
        .replace(/__BARCODE__/g, barcode)
        .replace(/__LINE1__/g, tr(lbl[0]))
        .replace(/__LINE2__/g, tr(lbl[1]))
        .replace(/__LINE3__/g, tr(lbl[2]))
        .replace(/__COUNT__/g, count)
      ;
    } else {
      code = labelCompactX3S60x40
        .replace(/__BARCODE__/g, barcode)
        .replace(/__LABEL__/g, tr(label.substring(0, 25)))
        .replace(/__COUNT__/g, count)
      ;
    }
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
