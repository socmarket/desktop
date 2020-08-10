export default function initAuthApi(axios, db) {
  return {
    sendCode: (msisdn, captcha) => axios.post("/api/auth/sendCode", {
      msisdn  : msisdn,
      captcha : captcha,
    }),
    verify: (msisdn, code) =>
      axios.post("/api/auth/verify", {
        msisdn : msisdn,
        code   : code,
      })
        .then(_ => {
        })
  }
}
