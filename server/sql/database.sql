CREATE DATABASE SHOHOJOG;
 CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 CREATE OR REPLACE FUNCTION set_product_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Set the status to 'available' after insert
    NEW.status := 'available';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_product_insert
AFTER INSERT ON product
FOR EACH ROW
EXECUTE FUNCTION set_product_status();

 CREATE OR REPLACE FUNCTION insert_message_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.isPaid = true THEN
        INSERT INTO Message (sender_id, receiver_id, message_time, message)
        VALUES (
            (SELECT user_id FROM Users WHERE user_type = 'Admin'),
            NEW.customer_id,
            CURRENT_TIMESTAMP,
            'Thanks for buying our product. Please give a review or message us for return.'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_update
AFTER UPDATE OF isPaid ON "Order"
FOR EACH ROW
EXECUTE FUNCTION insert_message_on_payment();
CREATE OR REPLACE FUNCTION insert_message()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.delivery_status IS NULL THEN
        INSERT INTO Message (sender_id, receiver_id, message_time, message)
        VALUES ((SELECT user_id FROM Users WHERE user_type = 'Admin'), NEW.customer_id, NOW(), 'Your Products are waiting in the cart. Buy them before stock runs out');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_message_trigger
AFTER INSERT ON "Order"
FOR EACH ROW
EXECUTE FUNCTION insert_message();
CREATE OR REPLACE PROCEDURE insert_message_procedure(customer_id_param UUID)
LANGUAGE SQL
AS $$
INSERT INTO Message (sender_id, receiver_id, message_time, message)
SELECT
    (SELECT user_id FROM Users WHERE user_type = 'Admin'),
    customer_id_param,
    NOW(),
    'Your Products order is sent to the Seller. Waiting for the drop-off'
FROM
    "Order"
WHERE
    delivery_status = 'seller unconfirmed';
$$;

CREATE OR REPLACE FUNCTION before_insert_location_full()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the new pst_code exists in the location table
    IF NOT EXISTS (SELECT 1 FROM location WHERE pst_code = NEW.pst_code) THEN
        -- Insert the new pst_code into the location table
        INSERT INTO location (pst_code) VALUES (NEW.pst_code);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_before_insert_location_full
BEFORE INSERT ON location_full
FOR EACH ROW
EXECUTE FUNCTION before_insert_location_full();



CREATE TABLE location_full (
    location_id SERIAL PRIMARY KEY,
    pst_code VARCHAR(10) ,
    street VARCHAR(255),
    area VARCHAR(255),
    town VARCHAR(255)
);

CREATE TABLE location (
    pst_code VARCHAR(10) PRIMARY KEY
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

---- -- THE PROCEDURE TO INSERT INTO TOP_SELLED 
CREATE OR REPLACE PROCEDURE INSERT_INTO_TOP_SELLED()
LANGUAGE plpgsql
AS $$
DECLARE 
    product_order_count INT;
    product_name1 VARCHAR(255);
    product_record RECORD;
BEGIN
    -- Clear existing data from the TOP_SELLED table
    DELETE FROM TOP_SELLED;  
    
    -- Loop through each product in the "Contains" table
    FOR product_record IN SELECT * FROM "Contains" LOOP
        -- Calculate total quantity of orders for the current product
        SELECT COALESCE(SUM(quantity), 0)
        INTO product_order_count
        FROM "Contains"
        WHERE product_id = product_record.product_id;
        
        -- Retrieve the product name corresponding to the current product_id
        SELECT Product_name 
        INTO product_name1 
        FROM Product 
        WHERE Product_id = product_record.product_id;
        
        -- Insert the product details into the TOP_SELLED table
        INSERT INTO TOP_SELLED (product_id, product_name, selled_quantity)
        VALUES (product_record.product_id, product_name1, product_order_count);
    END LOOP;
END;
$$;
-- TO GET TOP SELLED products
CREATE TABLE TOP_SELLED (
product_id INT,
product_name VARCHAR(255),
selled_quantity INT,
CONSTRAINT FK_CONTAINS_PRODUCT FOREIGN KEY (product_id) REFERENCES Product (product_id));

CREATE TABLE Seller (
    user_id uuid PRIMARY KEY,
    TIN VARCHAR(20), 
    Website VARCHAR(255),
		factory_address VARCHAR(255),
    office_address VARCHAR(255),
    company_name VARCHAR(255)
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

CREATE OR REPLACE FUNCTION update_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock = 0 THEN
        UPDATE Product
        SET status = 'out of stock'
        WHERE Product_id = NEW.Product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_update_trigger
AFTER UPDATE OF stock ON Product
FOR EACH ROW
EXECUTE FUNCTION update_status();

CREATE TABLE Product (
    Product_id SERIAL PRIMARY KEY,
    Product_name VARCHAR(255),
    Price DECIMAL(10, 2), 
    Product_category VARCHAR(50),
    Product_features TEXT,
    Seller_id uuid NOT NULL,
		Category_id INT NOT NULL,
        overall_rating DECIMAL(10, 2),
		Stock INT ,
    status VARCHAR(255)
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
    delivery_pst_code VARCHAR(10),
    vehicle_type VARCHAR(50),
    status VARCHAR(50),
    CONSTRAINT fk_delivery_pst_code FOREIGN KEY (delivery_pst_code) REFERENCES Location(pst_code),
    CONSTRAINT fk_courier_employee FOREIGN KEY (service_id) REFERENCES Employee(employee_id)
);


CREATE TABLE "Order" (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    isConfirm BOOLEAN NOT NULL,
    isPaid BOOLEAN NOT NULL,  
		payment_date DATE,
		delivery_time TIMESTAMP,
		customer_id uuid NOT NULL,
    delivery_status TEXT,
    delivery_date DATE,
    pickup_date DATE,
    courier_employee_id uuid ,	
    Rated BOOLEAN,
     CONSTRAINT fk_courier_employee FOREIGN KEY (courier_employee_id) REFERENCES Courier_Service(service_id),
		CONSTRAINT customer_order_fk FOREIGN KEY (customer_id) REFERENCES Customer (user_id),
    CONSTRAINT fk_courier_employee FOREIGN KEY (courier_employee_id) REFERENCES Courier_Service(service_id)
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
    order_id INT,
	customer_care_id uuid,
	CONSTRAINT FK_RETURN_ORDER  FOREIGN KEY (order_id) REFERENCES "Order"(order_id),
	CONSTRAINT FK_RETURN_customer_care  FOREIGN KEY (customer_care_id) REFERENCES Customer_Care(service_id),
	CONSTRAINT check_RETURN_STATUS CHECK (status IN ('approved', 'disapproved', 'pending'));
);



CREATE TABLE Contains (
    order_id INT,
    product_id INT,
    CONSTRAINT fk_contains_order FOREIGN KEY (order_id) REFERENCES "Order"(order_id) ON DELETE CASCADE;
    CONSTRAINT FK_CONTAINS_PRODUCT FOREIGN KEY (product_id) REFERENCES Product (product_id),
    CONSTRAINT PK_CONTAINS PRIMARY KEY (order_id, product_id),
    quantity INT,
    price DECIMAL(10, 2),
    CONSTRAINT NO_NEGATIVE_QUANTITY CHECK(quantity > 0),
    CONSTRAINT NO_NEGATIVE_PRICE CHECK(price >= 0)
    review TEXT,
    rating DECIMAL(10, 2),
    review_time TIMESTAMP;
);

