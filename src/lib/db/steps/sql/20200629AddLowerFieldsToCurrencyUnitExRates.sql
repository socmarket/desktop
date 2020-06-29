alter table currency add column titleLower varchar;
alter table currency add column notationLower varchar;

alter table unit add column titleLower varchar;
alter table unit add column notationLower varchar;

create table exchangerate(
  id integer primary key autoincrement,
  fromCurrencyId integer,
  toCurrencyId integer,
  rate varchar, -- 1 fromCurrency costs amount toCurrencies
  updatedAt datetime default current_timestamp,
  src varchar
);
