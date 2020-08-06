export default function initAuthApi(axios) {
  return {
    sendCode: (msisdn, captcha) => axios.post("/api/auth/sendCode", {
      msisdn  : msisdn,
      captcha : captcha,
    }),
  }
}
