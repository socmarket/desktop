const axios = require('axios').default

axios.defaults.baseURL = API_BASE_URL

export default function initServerApi(db) {
  return {
    checkHealth: () => axios.get('/api/health/check'),
  }
}
