create table salecheckreturn(
  id integer primary key autoincrement,
  saleCheckItemId integer,
  quantity integer,
  returnedAt datetime default current_timestamp,
  notes varchar(255) default ''
);
