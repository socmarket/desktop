create table sync(
  id integer,
  entity varchar,
  syncedAt datetime default current_timestamp,
  unique (entity, id)
);
