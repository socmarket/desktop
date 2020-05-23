export interface PrinterState {
  items: Array,
  errorMsg: String,
  rescanInProgress: Boolean,
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

function exec(vid, pid, code) {
  return function (dispatch, getState, { db, usb }) {
    usb.open(vid, pid)
      .then(_ => usb.write(code))
      .then(_ => usb.close())
      .catch(err => {
        console.log(err);
      })
    ;
  };
}

const PrinterActions = {
  rescanPrinters: rescanPrinters,
  print: exec,
};

function PrinterReducer (state: PrinterState = {
  list: [],
  errorMsg: "",
  rescanInProgress: false,
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
    default:
      return state;
  }
}

export { PrinterActions, PrinterReducer };
