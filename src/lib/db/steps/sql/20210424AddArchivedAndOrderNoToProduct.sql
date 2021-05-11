alter table product add column orderNo integer default 0;
alter table product add column archived boolean default false;
update product set orderNo = id;
create index product_order_idx on product(orderNo);
