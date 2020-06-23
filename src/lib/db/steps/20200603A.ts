import addLowerCaseColumnsToClientSupplier from "./sql/20200603AddLowerCaseColumnsToClientSupplier.sql";

export default function step(db, thisStepName) {
  return db.batch(addLowerCaseColumnsToClientSupplier)
    .then(_ => db.select("select id, name from client"))
    .then(rows =>
      rows.reduce(
        async (prevPromise, client) => {
          await prevPromise;
          return db.exec(
            "update client set nameLower=$nameLower where id=$id",
            {
              $id: product.id,
              $nameLower: client.name.toLowerCase(),
            }
          );
        },
        Promise.resolve()
      )
    )
    .then(_ => db.select("select id, name from supplier"))
    .then(rows =>
      rows.reduce(
        async (prevPromise, supplier) => {
          await prevPromise;
          return db.exec(
            "update supplier set nameLower=$nameLower where id=$id",
            {
              $id: supplier.id,
              $nameLower: supplier.name.toLowerCase(),
            }
          );
        },
        Promise.resolve()
      )
    )
  ;
}
