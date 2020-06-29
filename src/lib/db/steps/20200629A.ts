import AddLowerFieldsToCurrencyUnitExRatesSql from "./sql/20200629AddLowerFieldsToCurrencyUnitExRates.sql";

export default function step(db, thisStepName) {
  return db.batch(AddLowerFieldsToCurrencyUnitExRatesSql)
    .then(_ => db.select("select id, title, notation from currency"))
    .then(rows =>
      rows.reduce(
        async (prevPromise, currency) => {
          await prevPromise;
          return db.exec(
            "update currency set titleLower=$titleLower, notationLower=$notationLower where id=$id",
            {
              $id            : currency.id,
              $titleLower    : currency.title.toLowerCase(),
              $notationLower : currency.notation.toLowerCase(),
            }
          );
        },
        Promise.resolve()
      )
    )
    .then(_ => db.select("select id, title, notation from unit"))
    .then(rows =>
      rows.reduce(
        async (prevPromise, unit) => {
          await prevPromise;
          return db.exec(
            "update unit set titleLower=$titleLower, notationLower=$notationLower where id=$id",
            {
              $id            : unit.id,
              $titleLower    : unit.title.toLowerCase(),
              $notationLower : unit.notation.toLowerCase(),
            }
          );
        },
        Promise.resolve()
      )
    )
}
