const axios = require('axios').default
axios.defaults.baseURL = API_BASE_URL

import initAuthApi   from "./auth"
import initHealthApi from "./health"

export default function initServerApi(db) {
  return {
    auth: initAuthApi(axios),
    health: initHealthApi(axios),
  }
}
