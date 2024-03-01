select *
from seller s ;

select *
from users u ;

select *
from product_category pc ;

select *
from product p ;

INSERT INTO Courier_Service (service_id, delivery_area, vehicle_type)
VALUES ('48d86c9a-b092-4b4b-97f5-7a6a0a4b24ee', 'Downtown', 'Van');
drop table product ;
drop table product_offer ;
CREATE TABLE Product (
    Product_id SERIAL PRIMARY KEY,
    Product_name VARCHAR(255),
    Price DECIMAL(10, 2), -- 
    Product_category VARCHAR(50),
    Product_features TEXT,
    Seller_id uuid NOT NULL,
		Category_id INT NOT NULL,
		Stock INT ,
		CONSTRAINT NO_NEGATIVE_price CHECK(Price >= 0),
	--	CONSTRAINT STATUS_CHECK CHECK(Status is in ('upcoming','in stock','stock out')),
	 CONSTRAINT NO_NEGATIVE_STOCK CHECK (
        Stock >= 0
   ),
		CONSTRAINT Category_product FOREIGN KEY (Category_id) REFERENCES Product_category(Category_id),
   CONSTRAINT fk_seller_product FOREIGN KEY (seller_id) REFERENCES Seller(user_id)
);
-- TO INSERT INTO PRODUCT TABLE
INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock)
VALUES ('Laptop', 1200.00, 'Electronics', 'Core i7, 16GB RAM, 512GB SSD', 'fb4505e6-128f-404f-816c-91937c3225b7', 2, 10);

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock)
VALUES ('Smartphone', 800.00, 'Electronics', '6.5" Display, 128GB Storage, 5G', 'fb4505e6-128f-404f-816c-91937c3225b7', 2, 20);

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock)
VALUES ('Bluetooth Headphones', 80.00, 'Electronics', 'Noise Cancelling, 20 Hours Battery Life', 'fb4505e6-128f-404f-816c-91937c3225b7', 2, 15);

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock)
VALUES ('Wireless Mouse', 25.00, 'Electronics', 'Ergonomic Design, 1600 DPI', 'fb4505e6-128f-404f-816c-91937c3225b7', 2, 30);

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock)
VALUES ('External Hard Drive', 100.00, 'Electronics', '2TB Storage, USB 3.0', 'fb4505e6-128f-404f-816c-91937c3225b7', 2, 25);

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock)
VALUES ('Smart Watch', 150.00, 'Electronics', 'Heart Rate Monitor, Fitness Tracker', 'fb4505e6-128f-404f-816c-91937c3225b7', 2, 12);

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock)
VALUES ('Wireless Keyboard', 40.00, 'Electronics', 'Full Size, Silent Typing', 'fb4505e6-128f-404f-816c-91937c3225b7', 2, 18);
 
update product_category set category_name = 'Beauty' where product_category.category_id = 1;

ALTER TABLE Courier_Service
ADD COLUMN status VARCHAR(50);

CREATE TABLE Contains (
    order_id SERIAL,
    product_id SERIAL,
		CONSTRAINT FK_CONTAINS_ORDER FOREIGN KEY (order_id) REFERENCES "Order"(
	order_id),
    CONSTRAINT FK_CONTAINS_PRODUCT FOREIGN KEY (product_id) REFERENCES   Product(product_id),
		CONSTRAINT PK_CONTAINS PRIMARY KEY (order_id, product_id),
    quantity INT,
    price DECIMAL(10, 2),
   
    CONSTRAINT NO_NEGATIVE_QUANTITY CHECK(quantity > 0),
		CONSTRAINT NO_NEGATIVE_price CHECK(price >= 0)
    				
);

ALTER TABLE "Order"
ALTER COLUMN courier_employee_id DROP NOT NULL;


