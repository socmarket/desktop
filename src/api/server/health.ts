export default function initHealthApi(axios) {
  return {
    check: () => axios.get('/api/health/check'),
  }
}
