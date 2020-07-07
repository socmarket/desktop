import labelProg                     from "./tspl/label.tspl"
import labelCompactX3S60x40          from "./tspl/labelCompactX3S60x40.tspl"
import labelCompactX2MultilineS60x40 from "./tspl/labelCompactX2MultilineS60x40.tspl"
import labelFullMultilineS30x20      from "./tspl/labelFullMultilineS30x20.tspl"

import receiptTspl         from "./tspl/receipt.tspl"
import receiptBarlineTspl  from "./tspl/receiptBarline.tspl"
import receiptTextlineTspl from "./tspl/receiptTextline.tspl"

import diagFontsTspl from "./tspl/diagFonts.tspl"

import { transliterate as tr } from 'transliteration'


function wrap(txt) {
  const t = txt.match(/.{1,30}/g)
  return t
}

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
    printCheck: ({ check, logo, offsetX, printerId }) => {
      const bpid = printerId ? printerId + ":-1" : "-1:-1"
      const vid = parseInt(bpid.split(":")[0], 16)
      const pid = parseInt(bpid.split(":")[1], 16)
      let y = 160
      const lines = check.items
        .map(x => ({ ...x, title: tr(x.title) }))
        .map((x, idx) => ({
          barcode : x.barcode,
          text    : wrap(idx + ": " + x.title),
          price   : x.quantity + " X " + x.price + " = " + x.quantity * x.price
        }))
        .map(x => [
          receiptBarlineTspl.replace(/__BARCODE__/, x.barcode),
          x.text.map(t => receiptTextlineTspl.replace(/__TEXT__/, t)),
          receiptTextlineTspl.replace(/__TEXT__/, x.price),
        ].flat())
        .flat()
        .map(l => {
          const ll = l
            .replace(/__OFFSET_X__/, 5)
            .replace(/__OFFSET_Y__/, l.includes("BARCODE") ? y + 20 : y)
          if (l.includes("BARCODE")) {
            y += 70
          } else {
            y += 30
          }
          return ll
        })

      let code = receiptTspl
        .replace(/__LOGO1__/, logo[0])
        .replace(/__LOGO2__/, logo[1])
        .replace(/__LOGO3__/, logo[2])
        .replace(/__DT__/, check.dateTime)
        .replace(/__CONTENT__/, lines.join(""))
        .replace(/__HEIGHTMM__/, (y + 100) / 8)
        .replace(/__HEIGHT__/, y + 20)
        .replace(/__TOTAL__/, Math.round(check.items.map(x => x.quantity * x.price).reduce((a, b) => a + b)))

      console.log(code)

      return usb.open(vid, pid)
        .then(_ => usb.write(code))
        .then(_ => usb.close())
    },
    printLabel: ({ barcode, text, count, labelSize, offsetX, printerId }) => {
      const bpid = printerId ? printerId + ":-1" : "-1:-1"
      const vid = parseInt(bpid.split(":")[0], 16)
      const pid = parseInt(bpid.split(":")[1], 16)
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


