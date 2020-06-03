const sqlite3 = require("sqlite3").verbose();

export interface Database {
  exec(sql: string, params: object): Promise<void>;
  batch(sql: string, params: object): Promise<void>;
  select<A>(sql: string, params: object): Promise<A[]>;
  selectOne<A>(sql: string, params: object): Promise<A>;
}

function initDb(fileName: string): Database {
  const db = new sqlite3.Database(fileName);
  return {
    batch: function (sql: string, params: object) {
      return new Promise((resolve, reject) => {
        console.log(`batch: ${sql}`);
        if (sql.trim().length === 0) {
          resolve();
        } else {
          db.exec(sql, function (err: Error) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    },
    exec: function (sql: string, params: object) {
      return new Promise((resolve, reject) => {
        console.log(`exec: ${sql}`);
        if (sql.trim().length === 0) {
          resolve();
        } else {
          db.run(sql, params, function (err: Error) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    },
    select: function <A> (sql: string, params: object) {
      return new Promise<A[]>((resolve, reject) => {
        db.all(sql, params, function (err: Error, rows: A[]) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(rows);
          }
        })
      });
    },
    selectOne: function <A> (sql: string, params: object) {
      return new Promise<A>((resolve, reject) => {
        db.get(sql, params, function (err: Error, item: A) {
          if (err) {
            reject(err);
          } else {
            resolve(item);
          }
        })
      });
    },
  };
}

export default initDb;
