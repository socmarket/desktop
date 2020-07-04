create table importinfo(
  id integer primary key autoincrement,
  fileDir varchar,
  filePath varchar,
  fileName varchar,
  fields varchar,
  rowCount integer,
  unitId integer,
  categoryId integer,
  currencyId integer,
  importedCount integer,
  importedAt datetime default current_timestamp
);
