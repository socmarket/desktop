export interface PrinterState {
  items: Array,
  errorMsg: String,
  rescanInProgress: Boolean,
  vid: int,
  pid: int,
}

const printerRescanStarted = () => ({
  type: "PRINTER_RESCAN_STARTED",
});

const printerRescanFailed = (errorMsg) => ({
  type: "PRINTER_RESCAN_FAILED",
  errorMsg: errorMsg,
});

const printerRescanned = (items) => ({
  type: "PRINTER_RESCANNED",
  items: items,
})

const printerSelected = (vid, pid) => ({
  type: "PRINTER_SELECTED",
  vid: vid,
  pid: pid,
})

function rescanPrinters() {
  return function (dispatch, getState, { db, usb }) {
    dispatch(printerRescanStarted());
    usb.scan()
      .then(items => {
        dispatch(printerRescanned(items));
      })
      .catch(err => {
        dispatch(printerRescanFailed(err));
      })
    ;
  };
}

function print(code) {
  return function (dispatch, getState, { db, usb }) {
    const { printer } = getState();
    usb.open(printer.vid, printer.pid)
      .then(_ => usb.write(code))
      .then(_ => usb.close())
      .catch(err => {
        console.log(err);
      })
    ;
  };
}

function selectPrinter(vid, pid) {
  return function (dispatch, getState, { db, usb }) {
    dispatch(printerSelected(vid, pid));
  };
}

const PrinterActions = {
  rescanPrinters: rescanPrinters,
  print: print,
  selectPrinter: selectPrinter,
};

function PrinterReducer (state: PrinterState = {
  list: [],
  errorMsg: "",
  rescanInProgress: false,
  vid: 0,
  pid: 0,
}, action) {
  switch (action.type) {
    case "PRINTER_RESCAN_STARTED":
      return Object.assign({}, state, {
        errorMsg: "",
        rescanInProgress: true,
      });
    case "PRINTER_RESCAN_FAILED":
      return Object.assign({}, state, {
        errorMsg: action.errorMsg,
        rescanInProgress: false,
      });
    case "PRINTER_RESCANNED":
      return Object.assign({}, state, {
        list: action.items,
        errorMsg: "",
        rescanInProgress: false,
      });
    case "PRINTER_SELECTED":
      return Object.assign({}, state, {
        vid: action.vid,
        pid: action.pid,
      });
    default:
      return state;
  }
}

export { PrinterActions, PrinterReducer };
