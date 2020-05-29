export default function step(db, thisStepName) {
  const files = [
    { key: "20200317A.sql", content: require("./sql/20200317A.sql").default },
    { key: "20200317B.sql", content: require("./sql/20200317B.sql").default },
    { key: "20200318A.sql", content: require("./sql/20200318A.sql").default },
    { key: "20200318B.sql", content: require("./sql/20200318B.sql").default },
    { key: "20200318C.sql", content: require("./sql/20200318C.sql").default },
    { key: "20200318D.sql", content: require("./sql/20200318D.sql").default },
    { key: "20200319A.sql", content: require("./sql/20200319A.sql").default },
    { key: "20200319B.sql", content: require("./sql/20200319B.sql").default },
    { key: "20200320A.sql", content: require("./sql/20200320A.sql").default },
    { key: "20200322A.sql", content: require("./sql/20200322A.sql").default },
    { key: "20200323A.sql", content: require("./sql/20200323A.sql").default },
    { key: "20200323B.sql", content: require("./sql/20200323B.sql").default },
    { key: "20200323C.sql", content: require("./sql/20200323C.sql").default },
    { key: "20200325A.sql", content: require("./sql/20200325A.sql").default },
    { key: "20200326A.sql", content: require("./sql/20200326A.sql").default },
    { key: "20200523A.sql", content: require("./sql/20200523A.sql").default },
  ];
  return db.select("select mkey from migration where mkey='20200523A.sql'")
    .then(rows => {
      if (rows.length > 0) {
        return Promise.resolve()
      } else {
        const steps = files.sort((a, b) => a.key.localeCompare(b.key))
        return steps.reduce(async (prev, step) => {
          await prev;
          console.log(`${thisStepName}:${step.key}`);
          return db.batch(step.content);
        }, Promise.resolve());
      }
    })
  ;
}
