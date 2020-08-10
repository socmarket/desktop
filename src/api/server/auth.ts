import insertTokenSql from "./sql/auth/insertToken.sql"
import selectAccountsSql from "./sql/auth/selectAccounts.sql"

export default function initAuthApi(axios, db) {
  return {
    sendCode: (msisdn, captcha, fingerprint) => axios.post("/api/auth/sendCode", {
      msisdn      : msisdn,
      captcha     : captcha,
      fingerprint : fingerprint,
    }),
    verify: (msisdn, code) => {
      return axios.post("/api/auth/verify", {
          msisdn : msisdn,
          code   : code,
        }).then(res => {
          console.log(res)
          return db.exec(insertTokenSql, {
            $msisdn : res.msisdn + "",
            $token  : res.token,
          }).then(_ => res)
        })
    },
    accounts: () => {
      return db.select(selectAccountsSql)
    },
  }
}
