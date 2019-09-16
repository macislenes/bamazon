USE bamazon;

CREATE TABLE Products(
	item_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name varchar(30),
    department_name varchar(30),
    price float,
    stock_quantity int
);

INSERT INTO Products(product_name, department_name, price, stock_quantity)
VALUES
	('Apples', 'Produce', .15, 25),
    ('Bananas', 'Produce', .10, 30),
	('Tide', 'Cleaning', 4.50, 15),
    ('Bleach', 'Cleaning', 2.75, 20),
	('Toilet Paper', 'Paper Products', 7.50, 3),
    ('Paper Towels', 'Paper Products', 3, 7),
	('Red Bull', 'Beverages', 2.50, 10),
    ('Red Bull Orange', 'Beverages', 6, 15),
	('Dog Food', 'Pets', 45, 10),
    ('Dog Treats', 'Pets', 13, 8)

