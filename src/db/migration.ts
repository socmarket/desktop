function getLastKey(db) {
  return db.selectOne("select max(mkey) as maxmkey from migration")
    .then(row => row["maxmkey"])
  ;
}

const createMig = (db): Promise => {
  console.log("Migrations metadata not found, initializing...");
  return db.exec("create table migration(mkey varchar(255), mdate datetime default current_timestamp)");
}

function runUpdate(db, step) {
  return db.exec("begin")
    .then(async () => console.log(`migration step: ${step.key}`))
    .then(_ => db.batch(step.content))
    .then(_ => db.exec("insert into migration(mkey) values(?)", [ step.key ]))
    .then(_ => db.exec("commit"))
    .catch(err => {
      return db.exec("rollback")
        .then(_ => {
          throw err
        });
    })
  ;
}

function runUpdates(db, lastKey, steps) {
  console.log("Running updates...");
  const updates = lastKey ? steps.filter(x => x.key > lastKey) : steps
  if (updates.length === 0) {
    console.log("Database is up to date");
  } else {
    console.log(updates.length + " step(s) pending...");
  }
  return updates.reduce(async (prev, step) => {
    await prev;
    return runUpdate(db, step);
  }, Promise.resolve());
}

function init(db, steps): Promise<string> {
  return getLastKey(db)
    .catch(err =>
      createMig(db)
        .then(res => getLastKey(db))
        .then(lastKey => runUpdates(db, lastKey, steps))
    )
    .then(lastKey => runUpdates(db, lastKey, steps))
  ;
}

export default function migrate(db): Promise<string>  {
  const files = [
    { key: "20200317A.sql", content: require("./steps/20200317A.sql").default },
    { key: "20200317B.sql", content: require("./steps/20200317B.sql").default },
    { key: "20200318A.sql", content: require("./steps/20200318A.sql").default },
    { key: "20200318B.sql", content: require("./steps/20200318B.sql").default },
    { key: "20200318C.sql", content: require("./steps/20200318C.sql").default },
    { key: "20200318D.sql", content: require("./steps/20200318D.sql").default },
    { key: "20200319A.sql", content: require("./steps/20200319A.sql").default },
    { key: "20200319B.sql", content: require("./steps/20200319B.sql").default },
    { key: "20200320A.sql", content: require("./steps/20200320A.sql").default },
    { key: "20200322A.sql", content: require("./steps/20200322A.sql").default },
    { key: "20200323A.sql", content: require("./steps/20200323A.sql").default },
    { key: "20200323B.sql", content: require("./steps/20200323B.sql").default },
    { key: "20200323C.sql", content: require("./steps/20200323C.sql").default },
    { key: "20200325A.sql", content: require("./steps/20200325A.sql").default },
    { key: "20200326A.sql", content: require("./steps/20200326A.sql").default },
    { key: "20200523A.sql", content: require("./steps/20200523A.sql").default },
  ];
  const steps = files.sort((a, b) => a.key.localeCompare(b.key))
  return init(db, steps);
}
