import addAutoFieldsToProductSql from "./sql/20200621AddAutoFieldsToProduct.sql"

export default function step(db, thisStepName) {
  return db.batch(addAutoFieldsToProductSql);
};

