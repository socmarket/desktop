import labelProg from "./tspl/label.tspl"
import labelCompactX3S60x40 from "./tspl/labelCompactX3S60x40.tspl"
import labelCompactX2MultilineS60x40 from "./tspl/labelCompactX2MultilineS60x40.tspl"
import labelFullMultilineS30x20 from "./tspl/labelFullMultilineS30x20.tspl"
import createNewBarcode from "./sql/createNewBarcode.sql"
import selectUnusedBarcode from "./sql/selectUnusedBarcode.sql"

import { transliterate as tr } from 'transliteration';

export interface LabellerState {
  newBarcode: String;
  labelSize: String;
  barcodePrefix: String;
  barcodePrinterVid: Number;
  barcodePrinterPid: Number;
  errorMsg: String;
}

const newBarcodeCreated = (barcode) => ({
  type: "LABELLER_NEW_BARCODE_CREATED",
  barcode: barcode,
});

const labelSizeChanged = (labelSize) => ({
  type: "LABELLER_LABEL_SIZE_CHANGED",
  labelSize: labelSize,
});

const labellerFailed = (errorMsg) => ({
  type: "LABELLER_FAILED",
  errorMsg: errorMsg,
});

const barcodeUsed = () => ({
  type: "LABELLER_BARCODE_USED",
});

const barcodePrefixChanged = (barcodePrefix) => ({
  type: "LABELLER_BARCODE_PREFIX_CHANGED",
  barcodePrefix: barcodePrefix,
});

const barcodePrinterChanged = (barcodePrinterVid, barcodePrinterPid) => ({
  type: "LABELLER_BARCODE_PRINTER_CHANGED",
  barcodePrinterVid: barcodePrinterVid,
  barcodePrinterPid: barcodePrinterPid,
});

function reloadSettings() {
  return function (dispatch, getState, { db }) {
    return db.selectOne("select key, value from settings where key = 'barcode-prefix'")
      .then(barcodePrefix => db.selectOne("select key, value from settings where key = 'label-size'")
        .then(labelSize => db.selectOne("select key, value from settings where key = 'barcode-printer-id'")
          .then(barcodePrinterId => {
            const bp = barcodePrefix ? barcodePrefix.value : "Z";
            const ls = labelSize ? labelSize.value : "30x20";
            const bpid = barcodePrinterId ? barcodePrinterId.value + ":-1" : "-1:-1";
            const barcodePrinterVid = parseInt(bpid.split(":")[0], 16);
            const barcodePrinterPid = parseInt(bpid.split(":")[1], 16);
            dispatch(barcodePrefixChanged(bp));
            dispatch(labelSizeChanged(ls));
            dispatch(barcodePrinterChanged(barcodePrinterVid, barcodePrinterPid));
            return Promise.resolve();
          })
        )
      )
    ;
  };
}

function setLabelSize(labelSize) {
  return function (dispatch) {
    return db.exec("insert into settings(key, value) values('label-size', $labelSize) on conflict(key) do update set value=excluded.value", { $labelSize: labelSize })
      .then(_ => {
        return dispatch(labelSizeChanged(labelSize));
      })
    ;
  };
}

function setBarcodePrefix(prefix) {
  return function (dispatch, getState, { db }) {
    return db.exec("insert into settings(key, value) values('barcode-prefix', $prefix) on conflict(key) do update set value=excluded.value", { $prefix: prefix })
      .then(_ => {
        return dispatch(barcodePrefixChanged(prefix));
      })
    ;
  };
}

function setBarcodePrinter(barcodePrinterVid, barcodePrinterPid) {
  return function (dispatch, getState, { db }) {
    const id = `${barcodePrinterVid.toString(16)}:${barcodePrinterPid.toString(16)}`
    return db.exec("insert into settings(key, value) values('barcode-printer-id', $id) on conflict(key) do update set value=excluded.value", { $id: id })
      .then(_ => {
        return dispatch(barcodePrinterChanged(barcodePrinterVid, barcodePrinterPid));
      })
    ;
  };
}

function genBarcode() {
  return function (dispatch, getState, { db }) {
    const { labeller: { barcodePrefix } } = getState();
    return db.selectOne(selectUnusedBarcode, { $prefix: barcodePrefix })
      .then(row => {
        if (row) {
          dispatch(newBarcodeCreated(row.barcode));
        } else {
          return db.exec(createNewBarcode)
            .then(_ => db.selectOne(selectUnusedBarcode, { $prefix: barcodePrefix }))
            .then(row => {
              dispatch(newBarcodeCreated(row.barcode));
            });
        }
      })
  };
}

function printLabel(barcode, label, count = 1) {
  return function (dispatch, getState, { db, usb }) {
    const { labeller: { labelSize, barcodePrinterVid, barcodePrinterPid } } = getState();
    var code = ""
    if (labelSize === "60x40") {
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
    } else if (labelSize === "30x20") {
      const lbl = label.toUpperCase().match(/.{1,20}/g)
      while (lbl.length < 3) lbl.push("");
      code = labelFullMultilineS30x20
        .replace(/__BARCODE__/g, barcode)
        .replace(/__LINE1__/g, tr(lbl[0]))
        .replace(/__LINE2__/g, tr(lbl[1]))
        .replace(/__LINE3__/g, tr(lbl[2]))
        .replace(/__COUNT__/g, count)
      ;
    }
    console.log(code);
    if (barcodePrinterVid > 0 && barcodePrinterPid > 0) {
      if (barcode.length > 0 && label.length > 0) {
        usb.open(barcodePrinterVid, barcodePrinterPid)
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

function debugBarcodePrinter(code) {
  return function (dispatch, getState, { db, usb }) {
    const { labeller: { barcodePrinterVid, barcodePrinterPid } } = getState();
    usb.open(barcodePrinterVid, barcodePrinterPid)
      .then(_ => usb.write(code))
      .then(_ => usb.close())
      .catch(err => {
        console.log(err);
      })
    ;
  };
}

const LabellerActions = {
  debugBarcodePrinter: debugBarcodePrinter,
  useBarcode: useBarcode,
  genBarcode: genBarcode,
  printLabel: printLabel,
  setLabelSize: setLabelSize,
  setBarcodePrefix: setBarcodePrefix,
  setBarcodePrinter: setBarcodePrinter,
  reloadSettings: reloadSettings,
};

function LabellerReducer (state: LabellerState = {
  newBarcode: "",
  labelSize: "30x20",
  barcodePrefix: "Z",
  barcodePrinterVid: -1,
  barcodePrinterPid: -1,
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
    case "LABELLER_LABEL_SIZE_CHANGED":
      return Object.assign({}, state, {
        labelSize: action.labelSize,
      });
    case "LABELLER_BARCODE_PREFIX_CHANGED":
      return Object.assign({}, state, {
        barcodePrefix: action.barcodePrefix,
      });
    case "LABELLER_BARCODE_PRINTER_CHANGED":
      return Object.assign({}, state, {
        barcodePrinterVid: action.barcodePrinterVid,
        barcodePrinterPid: action.barcodePrinterPid,
      });
    default:
      return state;
  }
}

export { LabellerActions, LabellerReducer };
