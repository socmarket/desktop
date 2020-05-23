const IFACE_CLASS = {
  AUDIO  : 0x01,
  HID    : 0x03,
  PRINTER: 0x07,
  HUB    : 0x09,
};

function readDeviceData(dev, prn, reject) {
  try {
    dev.open();
    dev.getStringDescriptor(dev.deviceDescriptor.iProduct     , (v) => { prn.product = m; })
    dev.getStringDescriptor(dev.deviceDescriptor.iManufacturer, (v) => { prn.manufacturer = v; })
    dev.getStringDescriptor(dev.deviceDescriptor.iSerialNumber, (v) => { prn.serialNumber = m; })
    dev.close();
  } catch (err) {
    dev.close();
    reject(err);
  }
}

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

const scan = () => new Promise(
  (resolve, reject) => {
    const list = usbScanPrinters().map(dev => {
      const prn = {
        manufacturer: "",
        product: "",
        serialNumber: "",
        id: ""
      };
      return readDeviceData(dev, prn, reject);
    });
    resolve(list);
  }
);

export default {
  scan: scan
};
