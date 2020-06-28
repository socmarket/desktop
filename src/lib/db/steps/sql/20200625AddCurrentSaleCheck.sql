create table currentsalecheck(
  id integer primary key autoincrement,
  productId int,
  quantity long,
  price long,
  originalPrice long,
  unitId int default -1,
  currencyId int default -1,
  unique(productId)
);

alter table salecheckitem add column originalPrice long;
update salecheckitem set originalPrice = price;

alter table salecheck add column discount long;

-- Quantity was written as is in previous versions
update salecheckitem set quantity = round(quantity * 100);
update salecheck set cash = round(cash * 100), change = round(change * 100);
