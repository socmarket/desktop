import insertTokenSql from "./sql/auth/insertToken.sql"
import selectAccountsSql from "./sql/auth/selectAccounts.sql"

export default function initAuthApi(axios, db) {
  return {
    sendCode: (msisdn, captcha, fingerprint) => axios.post("/api/auth/sendCode", {
      msisdn      : msisdn,
      captcha     : captcha,
      fingerprint : fingerprint,
    }),
    verifyCode: (msisdn, code) => {
      return axios.post("/api/auth/verifyCode", {
          msisdn : msisdn,
          code   : code,
        }).then(res => {
          return db.exec(insertTokenSql, {
            $msisdn : res.data.msisdn + "",
            $token  : res.data.token,
          }).then(_ => res)
        })
    },
    accounts: () => {
      return db.select(selectAccountsSql)
    },
  }
}
