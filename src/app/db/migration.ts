import path from "path";
const file = require.context("./steps", true, /\.sql$/);

function getLastKey(db) {
  return new Promise( (resolve, reject) => {
    db.get("select max(mkey) as maxmkey from migration", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row["maxmkey"]);
      }
    });
  });
}

const createMig = (db): Promise => {
  return new Promise<string>( (resolve, reject) => {
    console.log("Migrations metadata not found, initializing...");
    db.get("create table migration(mkey varchar(255), mdate datetime default current_datetime)", (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function runUpdate(db, step) {
  return new Promise<string>( (resolve, reject) => {
    console.log("Applying " + step.key);
    console.log("SQL: " + step.content);
    db.run("begin", (err, res) => {
      if (err) {
        reject(err);
      } else {
        db.exec(step.content, (err, res) => {
          if (err) {
            console.log("Failed to apply " + step.key);
            console.log("Rolling back...");
            console.log(err);
            db.run("rollback", function (res, _err) {
              reject(err);
            });
          } else {
            db.run("insert into migration(mkey) values(?)", [ step.key ], (_res, _err) =>{
              if (_err) {
                db.run("rollback", function (res, _err) {
                  reject(err);
                });
              } else {
                db.run("commit", function (_res, err) {
                  if (err) {
                    reject(err);
                  } else {
                    console.log("Applied " + step.key);
                    resolve("OK");
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

function runUpdates(db, lastKey, steps) {
  console.log("Running updates...");
  const updates = lastKey ? steps.filter(x => x.key > lastKey) : steps
  if (updates.length === 0) {
    console.log("Database is up to date");
  } else {
    console.log(updates.length + " step(s) pending...");
  }
  updates.reduce(async (prev, step) => {
    await prev;
    return runUpdate(db, step);
  }, Promise.resolve());
}

function init(db, steps): Promise<string> {
  return getLastKey(db)
    .then(lastKey => runUpdates(db, lastKey, steps))
    .catch(err =>
      createMig(db)
        .then(res => getLastKey(db))
        .then(lastKey => runUpdates(db, lastKey, steps))
    )
  ;
}

export default function migrate(db): Promise<string>  {
  const steps = file.keys().map(key => ({
    key: path.basename(key),
    content: file(key).default
  })).sort((a, b) => a.key.localeCompare(b.key))
  return init(db, steps);
}
