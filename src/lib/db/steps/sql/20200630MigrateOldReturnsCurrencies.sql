-- there probably already some entered data (check < 100 must be sufficient)
update salecheckreturn set quantity = quantity * 100 where quantity < 100;

update price           set currencyId = 1 where currencyId = -1;
update consignmentitem set currencyId = 1 where currencyId = -1;
update salecheckitem   set currencyId = 1 where currencyId = -1;
update salecheck       set discount = 0   where discount is null
