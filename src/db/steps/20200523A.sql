create table settings(
  id integer primary key autoincrement,
  key varchar(255),
  value varchar(255),
  unique(key)
);

create table barcode(
  code integer primary key autoincrement
);
