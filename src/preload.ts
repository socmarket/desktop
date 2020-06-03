// in preload scripts, we have access to node.js and electron APIs
// the remote web app will not have access, so this is safe

const os                = require('os');
const { contextBridge } = require('electron');

import initApi from "./api";

const printer = {
  dev: null,
  vid: 0,
  pid: 0,
};

init();

function init() {
  let sqlite3 = require("sqlite3").verbose();
  let db = new sqlite3.Database("socmag.db");
  let _db = db;
  let _usb = initUsb();
  const api = initApi("socmag.db");

  contextBridge.exposeInMainWorld("usb", _usb);
  contextBridge.exposeInMainWorld("api", api);
  contextBridge.exposeInMainWorld("db", {

    batch: function (sql, params) {
      return new Promise((resolve, reject) => {
        console.log(`batch: ${sql}`);
        if (sql.trim().length === 0) {
          resolve("empty query");
        } else {
          _db.exec(sql, function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve("OK");
            }
          });
        }
      });
    },

    exec: function (sql, params) {
      return new Promise((resolve, reject) => {
        console.log(`exec: ${sql}`);
        if (sql.trim().length === 0) {
          resolve("empty query");
        } else {
          _db.run(sql, params, function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve("OK");
            }
          });
        }
      });
    },

    select: function (sql, params) {
      return new Promise((resolve, reject) => {
        _db.all(sql, params, function (err, rows) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(rows);
          }
        })
      });
    },

    selectOne: function (sql, params) {
      return new Promise((resolve, reject) => {
        console.log(`exec: ${sql}`);
        _db.get(sql, params, function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        })
      });
    }

  });
}

function initUsb() {

  const usb = require("usb");

  const IFACE_CLASS = {
    AUDIO  : 0x01,
    HID    : 0x03,
    PRINTER: 0x07,
    HUB    : 0x09,
  };

  const readString = (dev, key, res) => new Promise((resolve, reject) => {
    dev.getStringDescriptor(dev.deviceDescriptor[key], (err, v) => {
      if (err) {
        reject(err);
      } else {
        resolve(Object.assign({}, res, {
          [key]: v
        }));
      }
    });
  });

  const readDeviceData = (dev) => new Promise((resolve, reject) => {
    dev.open();
    readString(dev, "iProduct", {})
      .then(res => readString(dev, "iManufacturer", res))
      .then(res => readString(dev, "iSerialNumber", res))
      .then(res => {
        dev.close();
        res["idVendor"] = dev.deviceDescriptor.idVendor;
        res["idProduct"] = dev.deviceDescriptor.idProduct;
        res["id"] = res.idVendor.toString(16) + ":" + res.idProduct.toString(16);
        resolve(res);
      })
      .catch(err => {
        dev.close();
        reject(err);
      })
    ;
  });

  const usbScanPrinters = () => usb.getDeviceList()
    .filter(device => {
      try {
        return device
          .configDescriptor
          .interfaces
          .filter(iface =>
            iface
              .filter(conf => conf.bInterfaceClass === IFACE_CLASS.PRINTER)
              .length > 0
          ).length > 0;
      } catch(e) {
        // console.warn(e)
        return false;
      }
    })
  ;

  const isOpen = () => printer.dev != null;

  const scan = async () => await Promise.all(usbScanPrinters().map(dev => readDeviceData(dev)));

  const open = async (vid, pid) => new Promise((resolve, reject) => {
    printer.dev = usb.findByIds(vid, pid);
    if (!printer.dev) {
      reject(`Принтер не найден ${vid.toString(16)}:${pid.toString(16)}`);
    } else {
      usb.on('detach', function(dev) {
        if (dev == printer.dev) {
          printer.dev = null;
        }
      });
      printer.dev.open();
      printer.dev.interfaces.forEach(iface => {
        iface.setAltSetting(iface.altSetting, () => {
          // http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
          // libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows."
          if ("win32" !== os.platform()) {
            if(iface.isKernelDriverActive()) {
              try {
                iface.detachKernelDriver();
              } catch(e) {
                console.error("[ERROR] Could not detatch kernel driver: %s", e)
                reject(`[ERROR] Could not detatch kernel driver: ${e}`);
              }
            }
          }
          iface.claim(); // must be called before using any endpoints of this interface.
          iface.endpoints.forEach(endpoint => {
            if (endpoint.direction == 'out' && !printer.endpoint) {
              printer.endpoint = endpoint;
              resolve();
            }
          });
        });
      });
    }
  });

  const close = async () => new Promise((resolve, reject) => {
    if (printer.dev) {
      printer.dev.close();
      printer.dev = null;
      printer.endpoint = null;
      usb.removeAllListeners('detach');
    }
    resolve();
  });

  const write = async (str) => new Promise((resolve, reject) => {
    if (isOpen() && printer.endpoint) {
      printer.endpoint.transfer(str, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      reject(`Принтер не инициализирован.`);
    }
  });

  return {
    scan: scan,
    open: open,
    close: close,
    write: write,
    isOpen: isOpen
  };
}

