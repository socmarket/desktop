import addLowerCaseColumns from "./sql/addLowerCaseFields.sql";

export default function step(db, thisStepName) {
  return db.batch(addLowerCaseColumns)
    .then(_ => db.select("select id, title, notes from product"))
    .then(rows =>
      rows.reduce(
        async (prevPromise, product) => {
          await prevPromise;
          return db.exec(
            "update product set titleLower=$titleLower, notesLower=$notesLower where id=$id",
            {
              $id: product.id,
              $titleLower: product.title.toLowerCase(),
              $notesLower: product.notes.toLowerCase(),
            }
          );
        },
        Promise.resolve()
      )
    )
    .then(_ => db.select("select id, title from category"))
    .then(rows =>
      rows.reduce(
        async (prevPromise, category) => {
          await prevPromise;
          return db.exec(
            "update category set titleLower=$titleLower where id=$id",
            {
              $id: category.id,
              $titleLower: category.title.toLowerCase(),
            }
          );
        },
        Promise.resolve()
      )
    )
  ;
}
