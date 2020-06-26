import selectClientByIdSql   from "./sql/client/selectClientById.sql"
import selectClientByNameSql from "./sql/client/selectClientByName.sql"

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
    find: (namePattern: string) => db.select<Client>(selectClientByNameSql, { $pattern: namePattern.toLowerCase() })
  }
}
