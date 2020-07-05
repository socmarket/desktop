import labelProg                     from "./tspl/label.tspl"
import labelCompactX3S60x40          from "./tspl/labelCompactX3S60x40.tspl"
import labelCompactX2MultilineS60x40 from "./tspl/labelCompactX2MultilineS60x40.tspl"
import labelFullMultilineS30x20      from "./tspl/labelFullMultilineS30x20.tspl"

import { transliterate as tr } from 'transliteration'

export default function initPrinterApi(db, usb) {
  return {
    rescanPrinters: () => {
      return usb.scan()
    },
    runCode: (code, vid, pid) => {
      return usb.open(printer.vid, printer.pid)
        .then(_ => usb.write(code))
        .then(_ => usb.close())
    },
    printLabel: ({ barcode, text, count, labelSize, offsetX, printerId }) => {
      const bpid = printerId ? printerId + ":-1" : "-1:-1";
      const vid = parseInt(bpid.split(":")[0], 16);
      const pid = parseInt(bpid.split(":")[1], 16);
      var code = ""
      const label = tr(text).toUpperCase()
      if (labelSize === "60x40") {
        if (label.length > 18) {
          const lbl = label.match(/.{1,18}/g)
          while (lbl.length < 3) lbl.push("")
          code = labelCompactX2MultilineS60x40
            .replace(/__BARCODE__/g, barcode)
            .replace(/__LINE1__/g, lbl[0])
            .replace(/__LINE2__/g, lbl[1])
            .replace(/__LINE3__/g, lbl[2])
            .replace(/__COUNT__/g, count)
        } else {
          code = labelCompactX3S60x40
            .replace(/__BARCODE__/g, barcode)
            .replace(/__LABEL__/g, label.substring(0, 25))
            .replace(/__COUNT__/g, count)
        }
      } else if (labelSize === "30x20") {
        const lbl = label.match(/.{1,20}/g)
        while (lbl.length < 3) lbl.push("")
        code = labelFullMultilineS30x20
          .replace(/__BARCODE__/g, barcode)
          .replace(/__LINE1__/g, lbl[0])
          .replace(/__LINE2__/g, lbl[1])
          .replace(/__LINE3__/g, lbl[2])
          .replace(/__COUNT__/g, count)
          .replace(/__OFFSET_X__/g, offsetX)
      }
      console.log(code)
      if (vid > 0 && pid > 0) {
        if (barcode.length > 0 && label.length > 0) {
          return usb.open(vid, pid)
            .then(_ => usb.write(code))
            .then(_ => usb.close())
        } else {
          return Promise.reject("Товар не выбран или не зарегистрирован.")
        }
      } else {
        return Promise.reject("Принтер не выбран. Выберите принтер в настройках.")
      }
    },
  }
}


