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
    .then(_ => step.fun(db, step.key))
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
    )
    .then(lastKey => runUpdates(db, lastKey, steps))
  ;
}

export default async function migrate(db) {
  const files = [
    { key: "20200529A.ts", fun: require("./steps/20200529A.ts").default },
    { key: "20200529B.ts", fun: require("./steps/20200529B.ts").default },
    { key: "20200603A.ts", fun: require("./steps/20200603A.ts").default },
    { key: "20200604A.ts", fun: require("./steps/20200604A.ts").default },
    { key: "20200605A.ts", fun: require("./steps/20200605A.ts").default },
    { key: "20200621A.ts", fun: require("./steps/20200621A.ts").default },
    { key: "20200626A.ts", fun: require("./steps/20200625A.ts").default },
    { key: "20200627A.ts", fun: require("./steps/20200627A.ts").default },
    { key: "20200628A.ts", fun: require("./steps/20200628A.ts").default },
    { key: "20200629A.ts", fun: require("./steps/20200629A.ts").default },
    { key: "20200630A.ts", fun: require("./steps/20200630A.ts").default },
    { key: "20200703A.ts", fun: require("./steps/20200703A.ts").default },
    { key: "20200704A.ts", fun: require("./steps/20200704A.ts").default },
    { key: "20200709A.ts", fun: require("./steps/20200709A.ts").default },
    { key: "20200809A.ts", fun: require("./steps/20200809A.ts").default },
    { key: "20200903A.ts", fun: require("./steps/20200903A.ts").default },
    { key: "20201104A.ts", fun: require("./steps/20201104A.ts").default },
    { key: "20201110A.ts", fun: require("./steps/20201110A.ts").default },
    { key: "20201110B.ts", fun: require("./steps/20201110B.ts").default },
    { key: "20210123A.ts", fun: require("./steps/20210123A.ts").default },
    { key: "20210325A.ts", fun: require("./steps/20210325A.ts").default },
    { key: "20240424A.ts", fun: require("./steps/20210424A.ts").default },
  ];
  const steps = files.sort((a, b) => a.key.localeCompare(b.key))
  return init(db, steps);
}
