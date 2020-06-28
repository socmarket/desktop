import selectCurrencyByIdSql    from "./sql/currency/selectCurrencyById.sql"
import selectCurrencyByTitleSql from "./sql/currency/selectCurrencyByTitle.sql"

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
    find: (titlePattern: string) => db.select<Currency>(selectCurrencyByTitleSql, { $pattern: titlePattern.toLowerCase() })
  }
}
