create table consignmentprice(
  productId integer unique,
  price long,
  currencyId integer,
  updatedAt datetime default current_timestamp
);
