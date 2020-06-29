import AddLowerFieldsToCurrencyAndExRatesSql from "./sql/20200629AddLowerFieldsToCurrencyAndExRates.sql";

export default function step(db, thisStepName) {
  return db.batch(AddLowerFieldsToCurrencyAndExRatesSql)
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
}
