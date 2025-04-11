create extension if not exists "uuid-ossp";
create type cart_status as enum('OPEN','APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED', 'ORDERED');


create table users(
	id uuid not null default uuid_generate_v4() primary key, 
	name varchar(255) not null,
	email varchar(255) not null, 
	password varchar(255) not null
);

create table carts(
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null references users(id) on delete cascade,
	created_at date not null,
	updated_at date not null,
	status cart_status not null
);


create table cart_items(
	cart_id uuid not null references carts(id) on delete cascade,
	product_id uuid not null,
	count integer not null check (count >= 0),
	title varchar not null,
	description varchar not null,
	price numeric not null check (total >= 0)
);



create table orders(
	id uuid not null default uuid_generate_v4() primary key, 
	user_id uuid not null references users(id) on delete cascade, 
	cart_id uuid not null references carts(id) on delete cascade,
	payment json not null,
	delivery json not null,
	comments text,
	status cart_status,
	total numeric not null check (total >= 0),
	items json not null
);


insert into users (id, name, email, password)
values
    (uuid_generate_v4(), 'Ilia Shamakhia', 'ilia.shamakhia@example.com', 'password123')


insert into carts (id, user_id, created_at, updated_at, status)
values (
    uuid_generate_v4(),
    (select id from users where name = 'Ilia Shamakhia'),
    current_date,
    current_date,
    'OPEN'
);


insert into cart_items (cart_id, product_id, count, title, description, price)
values
    ((select id from carts where user_id = (select id from users where name = 'Ilia Shamakhia')), 'e590d5c5-68d1-4f29-bd95-5e351f991212', 2, 'title 1', 'description 1', 29.99),
    ((select id from carts where user_id = (select id from users where name = 'Ilia Shamakhia')), '6f3d22aa-b8a3-4b5a-85c6-9a11bfb6e777', 1, 'title 2', 'description 2', 39.99),
    ((select id from carts where user_id = (select id from users where name = 'Ilia Shamakhia')), '1b9e1a4b-52da-4ff6-a06f-35597c38a2f1', 7, 'title 3', 'description 3', 49.99);



insert into orders (id, user_id, cart_id, payment, delivery, comments, status, total, items)
values (
    uuid_generate_v4(),
    (select id from users where name = 'Ilia Shamakhia'),
    (select id from carts where user_id = (select id from users where name = 'Ilia Shamakhia')),
    '{"type": "credit card", "address": null, "creditCard": null}',
    '{"type": "standard", "address": "123 Main St"}',
    'sample comment',
    'ORDERED',
    150.0,
    '{ some items }'
);