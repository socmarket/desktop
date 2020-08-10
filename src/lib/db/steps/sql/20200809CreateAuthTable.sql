create table auth(
  msisdn varchar,
  token varchar,
  machineId varchar,
  updatedAt datetime default current_timestamp,
  unique (msisdn)
);
