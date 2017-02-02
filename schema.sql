CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT(10) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price FLOAT(10,2) NOT NULL,
stock_quantity INT(5) NOT NULL,
product_sales INT(5) NOT NULL,
PRIMARY KEY(item_id)
);

CREATE TABLE departments(
department_id INT(5) AUTO_INCREMENT NOT NULL,
department_name VARCHAR(50) NOT NULL,
over_head_costs INT(5) NOT NULL,
total_sales INT(11) NOT NULL,
PRIMARY KEY(department_id)
);