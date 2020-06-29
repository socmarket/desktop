import insertCurrencySql        from "./sql/currency/insertCurrency.sql"
import updateCurrencySql        from "./sql/currency/updateCurrency.sql"
import selectCurrencyByIdSql    from "./sql/currency/selectCurrencyById.sql"
import selectCurrencyByTitleSql from "./sql/currency/selectCurrencyByTitle.sql"
import selectExchangeRatesSql   from "./sql/currency/selectExchangeRates.sql"

export interface Currency {
  id: number
  title: string
  notation: string
}

export interface CurrencyApi {
  pick(id: number): Promise<Currency>
  find(pattern: string): Promise<Currency[]>
}

export default function initCurrencyApi(db) {
  return {
    pick: (id: number) => db.selectOne<Currency>(selectCurrencyByIdSql, { $currencyId: id }),
    find: (titlePattern: string) => db.select<Currency>(selectCurrencyByTitleSql, { $pattern: titlePattern.toLowerCase() }),
    insert: (currency) => (
      db.exec(insertCurrencySql, {
        $title         : currency.title     || "",
        $titleLower    : (currency.title    || "").toLowerCase(),
        $notation      : currency.notation  || "",
        $notationLower : (currency.notation || "").toLowerCase(),
      })
    ),
    update: (currency) => (
      db.exec(updateCurrencySql, {
        $id            : currency.id             ,
        $title         : currency.title     || "",
        $titleLower    : (currency.title    || "").toLowerCase(),
        $notation      : currency.notation  || "",
        $notationLower : (currency.notation || "").toLowerCase(),
      })
    ),
    selectExchangeRates: () => (
      db.select(selectExchangeRatesSql)
    ),
    updateRate: ({ fromCurrencyId, toCurrencyId, rate }) => (
      db.exec("insert into exchangerate(fromCurrencyId, toCurrencyId, rate) values(?, ?, ?)", [
        fromCurrencyId,
        toCurrencyId,
        String(rate),
      ])
    )
  }
}
