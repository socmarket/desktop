create table price(
  id integer primary key autoincrement,
  productId integer,
  price long,
  currencyId int default -1,
  setAt datetime default current_timestamp
)
