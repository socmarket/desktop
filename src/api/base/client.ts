import insertClientSql            from "./sql/client/insertClient.sql"
import updateClientSql            from "./sql/client/updateClient.sql"
import selectClientByIdSql        from "./sql/client/selectClientById.sql"
import selectClientByNameSql      from "./sql/client/selectClientByName.sql"
import selectJournalByIdSql       from "./sql/client/selectJournalById.sql"
import selectSaleCheckByIdSql     from "./sql/client/selectSaleCheckById.sql"
import selectSaleCheckItemsForSql from "./sql/client/selectSaleCheckItemsFor.sql"

export interface Client {
  id: number
  name: string
}

export interface ClientApi {
  pick(id: number): Promise<Client>
  find(pattern: string): Promise<Client[]>
}

export default function initClientApi(db) {
  return {
    pick: (id: number) => db.selectOne<Client>(selectClientByIdSql, { $clientId: id }),
    find: (namePattern: string) => db.select<Client>(selectClientByNameSql, { $pattern: namePattern.toLowerCase() }),
    selectJournalById: (clientId) => db.select<Client>(selectJournalByIdSql, { $clientId: clientId }),
    insert: (client) => (
      db.exec(insertClientSql, {
        $name      : client.name     || "",
        $nameLower : (client.name    || "").toLowerCase(),
        $contacts  : client.contacts || "",
        $notes     : client.notes    || "",
      })
    ),
    update: (client) => (
      db.exec(updateClientSql, {
        $id        : client.id            ,
        $name      : client.name     || "",
        $nameLower : (client.name    || "").toLowerCase(),
        $contacts  : client.contacts || "",
        $notes     : client.notes    || "",
      })
    ),
    moneyIn: ({ id, amount, currencyId }) => (
      db.exec("insert into clientbalance(clientId, amount, currencyId) values(?, ?, ?)", [
        id,
        amount * 100,
        currencyId,
      ])
    ),
    moneyOut: ({ id, amount, currencyId }) => (
      db.exec("insert into clientbalance(clientId, amount, currencyId) values(?, ?, ?)", [
        id,
        -amount * 100,
        currencyId,
      ])
    ),
    selectSaleCheckById: (saleCheckId) => {
      return db.selectOne(selectSaleCheckByIdSql, { $saleCheckId: saleCheckId })
        .then(saleCheck =>
          db.select(selectSaleCheckItemsForSql,  { $saleCheckId: saleCheckId })
            .then(items => ({
              ...saleCheck,
              items : items,
            }))
        )
    }
  }
}
