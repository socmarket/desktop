create table category(
  id integer primary key autoincrement,
  parentId integer default -1,
  title varchar(255),
  notes varchar(255)
);

alter table product add column categoryId integer default -1;
