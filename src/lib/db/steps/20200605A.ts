import createSaleCheckReturnSql from "./sql/20200605CreateSaleCheckReturn.sql"

export default function step(db, thisStepName) {
  return db.batch(createSaleCheckReturnSql);
};
