import path from "path"
const { dialog } = require("electron").remote


export default function initFileApi(db) {
  return {
    chooseFile: (defaultPath, extensions) => {
      const filesPromise = dialog.showOpenDialog({
        title: "Выберите файл",
        filters: [{
          name: "Табличные файлы",
          extensions: extensions,
        }],
        properties: ['openFile'],
        defaultPath: defaultPath ? defaultPath : "",
      })
      return filesPromise.then(result => {
        if (!result.cancelled && result.filePaths.length > 0) {
          return Promise.resolve({
            dir : path.dirname(result.filePaths[0]),
            path: result.filePaths[0],
            name: path.basename(result.filePaths[0]),
          })
        } else {
          return Promise.resolve()
        }
      })
    }
  }
}
