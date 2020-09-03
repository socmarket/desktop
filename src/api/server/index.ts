const axios = require('axios').default
axios.defaults.baseURL = API_BASE_URL

import initAuthApi   from "./auth"
import initHealthApi from "./health"
import initSyncApi   from "./sync"

export default function initServerApi(db) {
  return {
    auth: initAuthApi(axios, db),
    health: initHealthApi(axios, db),
    sync: initSyncApi(axios, db),
  }
}
