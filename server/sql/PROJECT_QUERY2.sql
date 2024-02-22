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
