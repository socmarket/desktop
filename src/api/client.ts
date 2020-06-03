import { Database } from "./db"

// @ts-ignore
import selectClientById from "./sql/client/selectClientById.sql"
// @ts-ignore
import selectClientByTitle from "./sql/client/selectClientByTitle.sql"

export interface Client {
  id: number;
  title: string;
};

export interface ClientApi {
  pick(id: number): Promise<Client>;
  find(pattern: string): Promise<Client[]>;
};

export default function initClientApi(db: Database): ClientApi {
  return {
    pick: (id: number) => db.selectOne<Client>(selectClientById, { $clientId: id }),
    find: (titlePattern: string) => db.select<Client>(selectClientByTitle, { $pattern: titlePattern.toLowerCase() })
  };
};
