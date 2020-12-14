const { webContents } = require("electron").remote
const fs = require("fs")
const os = require("os")
const path = require("path")
const { ipcRenderer, shell } = require("electron")

const pdfPath = path.join(os.homedir(), "Desktop", "temp.pdf")

function makePrintToPdf() {
  return (function (id) {
    webContents.fromId(id)
      .printToPDF({
        landscape: false,
        pageSize: "A4",
        printBackground: true,
        marginsType: 0,
        pageRanges: {
          from: 0,
          to: 1000,
        },
      })
      .then(data => {
        return new Promise((resolve, reject) => {
          fs.writeFile(pdfPath, data, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(shell.openItem(pdfPath))
            }
          })
        })
      }).catch(error => {
        console.log(`Failed to write PDF to ${pdfPath}: `, error)
      })
  })
}

function initPcPrinter() {

  return {
    printToPdf: makePrintToPdf(),
  }

}

export { initPcPrinter }
