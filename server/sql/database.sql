CREATE DATABASE SHOHOJOG;
 CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE Location (
    pst_code VARCHAR(10) PRIMARY KEY,
    street VARCHAR(255),
    area VARCHAR(255),
    town VARCHAR(255)
    
);

CREATE TABLE Users (
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    First_Name VARCHAR(50) NOT NULL,
    Middle_Name VARCHAR(50) ,
    Last_Name VARCHAR(50) NOT NULL,
		user_name VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL UNIQUE,
    contact_no VARCHAR(15) NOT NULL,
    e_mail VARCHAR(200) NOT NULL,
    location_pst_code VARCHAR(10) NOT NULL,
		user_type VARCHAR(255) NOT NULL,
		CONSTRAINT CHECK_USER_TYPE CHECK (
				user_type = 'seller' OR user_type = 'customer' OR user_type = 'employee'),	
		 CONSTRAINT USER_LOCATION FOREIGN KEY (location_pst_code) REFERENCES Location(pst_code)
    
   -- UNIQUE (First_Name, Middle_Name, Last_Name)
);


CREATE TABLE Seller (
    user_id uuid PRIMARY KEY,
    TIN VARCHAR(20), 
    Website VARCHAR(255),
		factory_address VARCHAR(255),
    office_address VARCHAR(255),
     CONSTRAINT SELLER_USER_FK FOREIGN KEY (user_id) REFERENCES Users(User_id)
);


CREATE TABLE Customer (
    user_id uuid PRIMARY KEY,
		CONSTRAINT CUSTOMER_USER_FK FOREIGN KEY (user_id) REFERENCES Users(User_id)
);

CREATE TABLE Product_category(
Category_id SERIAL PRIMARY KEY,
Category_name VARCHAR(50)
);


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

CREATE TABLE Message (
    Message_id SERIAL PRIMARY KEY,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    message_time TIMESTAMP NOT NULL,
    message TEXT,
    -- Other message-related attributes
   CONSTRAINT MESSAGE_SENDER  FOREIGN KEY (sender_id) REFERENCES Users(user_id),
   CONSTRAINT MESSAGE_receiver FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);

CREATE TABLE Offer (
    offer_id SERIAL PRIMARY KEY,
    starting_date DATE,
		ending_date DATE,
    discount_rate DECIMAL(5, 2), -- Adjust precision and scale as needed
    product_id INT,
   CONSTRAINT product_offer_fk  FOREIGN KEY (product_id) REFERENCES Product(Product_id),
	 CONSTRAINT NO_NEGATIVE_discount CHECK (discount_rate >= 0) 
);
CREATE TABLE Product_offer(
product_id INT ,
offer_id INT,
CONSTRAINT FK_offer_and_product_offer FOREIGN KEY (offer_id) REFERENCES Offer(offer_id),
 CONSTRAINT FK_offer_product_and_PRODUCT FOREIGN KEY (product_id) REFERENCES Product(product_id),
		CONSTRAINT PK_Product_offer PRIMARY KEY (offer_id, product_id)
);
CREATE TABLE Employee (
    employee_id uuid PRIMARY KEY,
    salary DECIMAL(10, 2),
		employee_type  VARCHAR(255),
		CONSTRAINT EMPLOYEE_USER_FK FOREIGN KEY (employee_id) REFERENCES Users (User_id),
		CONSTRAINT CHECK_employee_TYPE CHECK (
				employee_type in ('courier_service','customer_care')
		),
		CONSTRAINT NO_NEGATIVE_price CHECK(salary >= 0)
);

CREATE TABLE Courier_Service (
    service_id uuid PRIMARY KEY,
    delivery_area VARCHAR(50),
    vehicle_type VARCHAR(50),
		CONSTRAINT fk_courier_employee FOREIGN KEY (service_id) REFERENCES Employee(employee_id)
);
Alter ADD_COLUMN Courier_Service (status VARCHAR(50));
CREATE TABLE Order (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    isConfirm BOOLEAN NOT NULL,
    isPaid BOOLEAN NOT NULL,  
		payment_date DATE,
		delivery_time TIMESTAMP,
		customer_id uuid NOT NULL,
    courier_employee_id uuid NOT NULL,-- Foreign key referencing Courier_Service		
     CONSTRAINT fk_courier_employee FOREIGN KEY (courier_employee_id) REFERENCES Courier_Service(service_id),
		CONSTRAINT customer_order_fk FOREIGN KEY (customer_id) REFERENCES Customer (user_id)
);

CREATE TABLE Customer_Care (
   service_id uuid PRIMARY KEY,
    CONSTRAINT CUSTOMER_CARE_EMPLOYEE_FK FOREIGN KEY (service_id) REFERENCES Employee(employee_id)
);


CREATE TABLE Return_Order (
    return_id SERIAL PRIMARY KEY,
    return_date DATE,
    status VARCHAR(50),
    complaint TEXT,
		approval_time TIMESTAMP,
		delivery_time TIMESTAMP,
    order_id INT,
		customer_care_id uuid,
		courier_service_id uuid,
		CONSTRAINT FK_RETURN_ORDER  FOREIGN KEY (order_id) REFERENCES "Order"(order_id),
			CONSTRAINT FK_COURIER_RETURN_ORDER  FOREIGN KEY (courier_service_id) REFERENCES Courier_Service(service_id),
		CONSTRAINT FK_RETURN_customer_care  FOREIGN KEY (customer_care_id) REFERENCES Customer_Care(service_id),
		CONSTRAINT check_RETURN_STATUS CHECK (status in ('approved','disapproved')),
		CONSTRAINT check_RETURN_courier CHECK ((status = 'disapproved' AND courier_service_id IS NULL AND delivery_time IS NULL) OR (courier_service_id IS NOT  NULL AND delivery_time IS NOT NULL) )
		
		--CONSTRAINT STATUS_CHECK CHECK(Status is in ('upcoming','in stock','stock out')),
  -- CONSTRAINT FK_RETURN_ORDER  FOREIGN KEY (order_id) REFERENCES "Order"(order_id)
	-- CONSTRAINT FK_RETURN_customer_care  FOREIGN KEY (customer_care_id) REFERENCES "Customer_Care"(employee_id);
);



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

CREATE TABLE Review (
customer_id uuid,
    product_id SERIAL,
  CONSTRAINT FK_Review_Customer FOREIGN KEY (customer_id) REFERENCES Customer(user_id),
 CONSTRAINT FK_Review_Product FOREIGN KEY    (product_id) REFERENCES Product(product_id),
    CONSTRAINT PK_REVIEW PRIMARY KEY (customer_id,product_id),
    comments TEXT,
    comment_time TIMESTAMP,
    rating DECIMAL(10, 2)
);
