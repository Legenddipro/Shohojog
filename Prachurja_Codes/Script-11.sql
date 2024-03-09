select * from users where user_id = 'fb4505e6-128f-404f-816c-91937c3225b7';

select * from product;

select * from contains;

drop table contains;


CREATE TABLE Contains (
    order_id INT,
    product_id INT,
    CONSTRAINT FK_CONTAINS_ORDER FOREIGN KEY (order_id) REFERENCES "Order" (order_id),
    CONSTRAINT FK_CONTAINS_PRODUCT FOREIGN KEY (product_id) REFERENCES Product (product_id),
    CONSTRAINT PK_CONTAINS PRIMARY KEY (order_id, product_id),
    quantity INT,
    price DECIMAL(10, 2),
    CONSTRAINT NO_NEGATIVE_QUANTITY CHECK(quantity > 0),
    CONSTRAINT NO_NEGATIVE_PRICE CHECK(price >= 0)
);


INSERT INTO Customer (user_id)
VALUES ('4522c13c-efaa-4f32-9227-2455050a4e37');


SELECT 
        "Order".order_id,
        "Order".order_date,
        "Order".isConfirm,
        Contains.quantity,
        Contains.price,
        Product.product_name,
        Product.product_category
      FROM 
        "Order"
      JOIN 
        Contains ON "Order".order_id = Contains.order_id
      JOIN 
        Product ON Contains.product_id = Product.product_id
      WHERE 
        "Order".customer_id = '4522c13c-efaa-4f32-9227-2455050a4e37'
        AND "Order".isConfirm = false;


select * from "Order";


UPDATE Contains
      SET quantity = quantity - 9
      WHERE order_id = 18 and quantity>10;
      
     
-- Empty the Contains table
DELETE FROM Contains;

-- Empty the Orders table
DELETE FROM "Order";


select * from "Order" o join contains c on (o.order_id = c.order_id) order by c.order_id;


select * from employee e ;

select * from courier_service where service_id = 'df6378f0-da75-4d3e-a398-8f80e4291bb2';


CREATE TABLE Courier_Service (
    service_id uuid PRIMARY KEY,
    delivery_pst_code VARCHAR(10),
    vehicle_type VARCHAR(50),
    status VARCHAR(50),
    pst_code VARCHAR(10),
    CONSTRAINT fk_delivery_pst_code FOREIGN KEY (delivery_pst_code) REFERENCES Location(pst_code),
    CONSTRAINT fk_courier_employee FOREIGN KEY (service_id) REFERENCES Employee(employee_id)
);


ALTER TABLE Courier_Service DROP COLUMN pst_code;


ALTER TABLE Courier_Service
drop CONSTRAINT chk_status ;


SELECT employee_type FROM employee where ;


SELECT 
        u.First_Name, 
        u.Last_Name, 
        u.e_mail,
        u.contact_no 
        l.town, 
        cs.vehicle_type 
      FROM 
        Users u 
      INNER JOIN 
        Courier_Service cs ON u.user_id = cs.service_id 
      INNER JOIN 
        Location l ON cs.delivery_pst_code = l.pst_code 
      WHERE 
        u.user_id = 'df6378f0-da75-4d3e-a398-8f80e4291bb2';
   
       
ALTER TABLE Product
ADD Seller_status VARCHAR(20) CHECK (Seller_status IN ('Available', 'Unavailable'));


ALTER TABLE Seller
ADD company_name VARCHAR(255);


UPDATE Seller
SET company_name = 'Alexander Electronics'
WHERE user_id = 'fb4505e6-128f-404f-816c-91937c3225b7';


select * from users;


ALTER TABLE "Order"
ADD delivery_status TEXT;


select * from "Order"  WHERE customer_id = '4522c13c-efaa-4f32-9227-2455050a4e37'  AND isConfirm = false;
UPDATE "Order" SET isConfirm = false, delivery_status = NULL  WHERE customer_id = '4522c13c-efaa-4f32-9227-2455050a4e37';


rollback;
      

SELECT Product.*,
          Contains.quantity
          FROM Product
          JOIN Contains ON Product.product_id = Contains.product_id
          WHERE Contains.order_id = ANY(SELECT "Order".order_id
          FROM "Order"
          JOIN Contains ON "Order".order_id = Contains.order_id
          JOIN Product ON Contains.product_id = Product.product_id
          WHERE "Order".isConfirm = TRUE 
          AND "Order".delivery_status = 'seller unconfirmed' 
          AND Product.seller_id = 'fb4505e6-128f-404f-816c-91937c3225b7');
          
         
ALTER TABLE "Order"
ADD COLUMN delivery_date DATE,
ADD COLUMN pickup_date DATE;


commit;


SELECT Product.*, Contains.quantity, Contains.order_id
FROM Product
JOIN Contains ON Product.product_id = Contains.product_id
WHERE Contains.order_id = 19;


select * from "location" l ;



ALTER TABLE users DROP CONSTRAINT user_location CASCADE;
ALTER TABLE courier_service DROP CONSTRAINT fk_delivery_pst_code CASCADE;
ALTER TABLE Location DROP CONSTRAINT location_pkey;

ALTER TABLE Location
ADD COLUMN location_id SERIAL PRIMARY KEY;

select * from "location" l ;


rollback;

ALTER TABLE Location RENAME TO location_full;

commit;

CREATE TABLE location (
    pst_code VARCHAR(10) PRIMARY KEY
);

ALTER TABLE users
ADD CONSTRAINT USER_LOCATION FOREIGN KEY (location_pst_code) REFERENCES location(pst_code);

select * from users;

INSERT INTO location (pst_code) VALUES ('12345'), ('54321'), ('67890');

select * from location;

ALTER TABLE courier_service
ADD CONSTRAINT fk_delivery_pst_code
FOREIGN KEY (delivery_pst_code)
REFERENCES location(pst_code);


select * from employee e ;

select * from courier_service cs ;

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

ALTER TABLE location_full
ADD CONSTRAINT fk_location_full_pst_code
FOREIGN KEY (pst_code)
REFERENCES location(pst_code);
CREATE TRIGGER trg_before_insert_location_full
BEFORE INSERT ON location_full
FOR EACH ROW
EXECUTE FUNCTION before_insert_location_full();

INSERT INTO location_full (pst_code, street, area, town)
VALUES ('123457', 'Main Street', 'Downtown', 'City1'),
       ('543231', 'Oak Avenue', 'Suburb', 'City2'),
       ('678290', 'Maple Drive', 'Residential', 'City3');
      
select * from "location" l ;

select * from "Order" o where o.delivery_status = 'Seller confirms';

SELECT *      
	FROM 
        "Order" o
      INNER JOIN 
        Courier_Service cs ON o.courier_employee_id = cs.service_id
      WHERE 
        o.delivery_status = 'Seller confirms' AND 
        (SELECT location_pst_code FROM Users WHERE user_id = o.customer_id) = 
        (SELECT delivery_pst_code FROM Courier_Service WHERE service_id = 'df6378f0-da75-4d3e-a398-8f80e4291bb2');
select *
from "Order" o 
where customer_id = '4522c13c-efaa-4f32-9227-2455050a4e37';

select * from users u 
where user_id = '4522c13c-efaa-4f32-9227-2455050a4e37';

ALTER TABLE "Order"
ADD CONSTRAINT fk_courier_employee
FOREIGN KEY (courier_employee_id) REFERENCES Courier_Service(service_id);

ALTER TABLE Users
DROP CONSTRAINT check_user_type;
INSERT INTO Users (
    user_id,
    First_Name,
    Middle_Name,
    Last_Name,
    user_name,
    user_password,
    contact_no,
    e_mail,
    location_pst_code,
    user_type
)
VALUES (
    uuid_generate_v4(),
    'I',
    'Am',
    'The Creator',
    'Admin',
    'Abcd1234',
    '+8801307437069',
    'admin@control.com',
    '12345',
    'Admin'
)
ON CONFLICT DO NOTHING;

ALTER TABLE Users
ADD CONSTRAINT check_user_type CHECK (
    user_type IN ('seller', 'customer', 'employee', 'Admin')
);


DELETE FROM Users
WHERE e_mail = 'admin@control.com';

select * from users u ;

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

select * from message m order by message_time ;

select * from "Order" o ;


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

select * from message m  ;

select * from "Order" o ;

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

CREATE OR REPLACE FUNCTION send_messages_on_delivery_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.delivery_status = 'Courier confirmed' THEN
        -- Message to customer
        INSERT INTO Message (sender_id, receiver_id, message_time, message)
        VALUES (
            (SELECT user_id FROM Users WHERE user_type = 'Admin'),
            NEW.customer_id,
            CURRENT_TIMESTAMP, -- Use the current system timestamp
            'Courier recieved your product on ' || TO_CHAR(NEW.pickup_date, 'YYYY-MM-DD') || '. Our courier is on the way.'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER on_delivery_confirmation
AFTER UPDATE OF delivery_status ON "Order"
FOR EACH ROW
EXECUTE FUNCTION send_messages_on_seller_confirmation();

CREATE OR REPLACE FUNCTION send_messages_on_seller_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.delivery_status = 'Seller confirms' THEN
        -- Message to customer
        INSERT INTO Message (sender_id, receiver_id, message_time, message)
        VALUES (
            (SELECT user_id FROM Users WHERE user_type = 'Admin'),
            NEW.customer_id,
            CURRENT_TIMESTAMP, -- Use the current system timestamp
            'You will receive the product'
            || CASE 
                WHEN NEW.pickup_date IS NOT NULL THEN ' on ' || TO_CHAR(NEW.pickup_date, 'YYYY-MM-DD')
                ELSE ''
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER on_seller_confirmation
AFTER UPDATE OF delivery_status ON "Order"
FOR EACH ROW
EXECUTE FUNCTION send_messages_on_seller_confirmation();


select * from message m ;

select * from "Order" o order by order_id ;

alter table product 
drop column seller_status;

-- TO GET TOP SELLED products
CREATE TABLE TOP_SELLED (
product_id INT,
product_name VARCHAR(255),
selled_quantity INT,
CONSTRAINT FK_CONTAINS_PRODUCT FOREIGN KEY (product_id) REFERENCES Product (product_id));

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
    FOR product_record IN SELECT * FROM Contains LOOP
        -- Calculate total quantity of orders for the current product
        SELECT COALESCE(SUM(quantity), 0)
        INTO product_order_count
        FROM Contains
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

select * from users u join employee e on u.user_id = e.employee_id ;

select distinct product_id,product_name, selled_quantity from top_selled ;


alter table product 
add column status varchar(255);

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

UPDATE product
SET status = 'available'
WHERE status IS NULL;

select * from product;

select * from "contains" c ;

SELECT * FROM product where seller_id = 'fb4505e6-128f-404f-816c-91937c3225b7' and status = 'available';

-- DROP FUNCTION public.update_status();

CREATE OR REPLACE FUNCTION public.update_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.stock > 0 THEN
        NEW.status := 'Available';
    ELSIF NEW.stock = 0 THEN
        NEW.status := 'Out of stock';
    else 
         NEW.status := 'Restocking needed';
            -- Raise the previous exception for negative stock values
        	new.stock := old.stock;
            --RAISE EXCEPTION 'Restocking needed. Product ID: %', NEW.product_id;
        
    END IF;
    RETURN NEW;
END;
$function$
;


CREATE or replace TRIGGER before_insert_update_status
before  INSERT OR UPDATE ON public.product
FOR EACH ROW
EXECUTE FUNCTION update_status();




ALTER TABLE product 
ADD COLUMN delete_status varchar(255);


select *
from "contains" c 
where order_id = 48;


select * from product p order by product_id desc;

select * from "Order" o order  by order_id desc;

SELECT status
      FROM Product
      WHERE product_id IN (
        SELECT product_id FROM Contains WHERE order_id = 55
      );

update product p 
set stock = 0
where product_id = 6;

DROP TRIGGER IF EXISTS stock_update_trigger ON Product;

rollback;

DROP FUNCTION public.set_product_status() cascade;

SELECT * FROM product where stock >= 0 and status = 'Available'

UPDATE product
SET delete_status = 'available'
WHERE delete_status IS NULL;

CREATE OR REPLACE FUNCTION update_order_status(order_id INT, pickup_date DATE)
RETURNS VOID AS $$
DECLARE
    product_status TEXT;
BEGIN
    -- Get the current product statuses
    SELECT status INTO product_status
    FROM Product
    WHERE product_id IN (
        SELECT product_id FROM Contains WHERE Contains.order_id = update_order_status.order_id
    );

    -- Check if any product status indicates restocking needed or out of stock
    IF product_status IN ('Restocking needed', 'Out of stock') THEN
        -- Do not update the delivery status
        RETURN;
    
else
--- Update the delivery status to 'Seller confirm'
update
	"Order"
set
	delivery_status = 'Seller confirm',
	pickup_date = update_order_status.pickup_date
where
	"Order".order_id = update_order_status.order_id;

    END IF;
END;
$$ LANGUAGE plpgsql;

select * from product p order by product_id ;
select * from "Order" o order by order_id desc ;

-- Create the trigger function
CREATE OR REPLACE FUNCTION check_contains_quantity()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the quantity exceeds the stock for the product
    IF NEW.quantity > (
        SELECT stock FROM Product WHERE product_id = NEW.product_id
    ) THEN
        -- Raise an exception if the quantity exceeds the stock
        RAISE EXCEPTION 'Quantity exceeds stock for product %', NEW.product_id;
    END IF;

    -- If the check passes, return the NEW row
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the Contains table
CREATE TRIGGER contains_quantity_trigger
BEFORE INSERT OR UPDATE OF quantity ON Contains
FOR EACH ROW
EXECUTE FUNCTION check_contains_quantity();


---  a function to calcalute product count for each customer
CREATE OR REPLACE FUNCTION get_total_products_ordered(customer_id1  uuid)
RETURNS INT AS
$$
DECLARE
    total_products INT;
BEGIN
    SELECT SUM(con.quantity) INTO total_products
    FROM customer cus 
    JOIN "Order" o ON cus.user_id = o.customer_id
    JOIN Contains con ON con.order_id = o.order_id
    WHERE cus.user_id = customer_id1;
    
    RETURN total_products;
END;
$$
LANGUAGE plpgsql;
DROP FUNCTION IF EXISTS get_total_products_ordered(uuid);
--- to test this function 
SELECT 
    cus.user_id, 
    COALESCE(get_total_products_ordered(cus.user_id), 0) AS total_products_ordered
FROM 
    customer cus 
ORDER BY 
    total_products_ordered DESC;
   
   
   
   
   CREATE TABLE TOP_SOLD_BETWEEN_DATES (
product_id INT,
product_name1 VARCHAR(255),
selled_quantity INT,
starting_date DATE,
ending_date DATE,
CONSTRAINT FK_CONTAINS_PRODUCT FOREIGN KEY (product_id) REFERENCES Product (product_id));

  
CREATE OR REPLACE PROCEDURE INSERT_INTO_TOP_SOLD_BETWEEN_DATES(
    start_date DATE,
    end_date DATE
)
LANGUAGE plpgsql
AS $$
DECLARE 
    product_order_count INT;
    product_name1 VARCHAR(255);
    product_record RECORD;
BEGIN
    -- Clear existing data from the TOP_SOLD_BETWEEN_DATES table
    DELETE FROM TOP_SOLD_BETWEEN_DATES;
    
    -- Loop through each product in the "Contains" table
    FOR product_record IN (
        SELECT DISTINCT product_id
        FROM Contains con JOIN "Order" o ON ( o.order_id = con.order_id)
        WHERE payment_date BETWEEN start_date AND end_date
    ) LOOP
        -- Calculate total quantity of orders for the current product between specified dates
        SELECT COALESCE(SUM(quantity), 0)
        INTO product_order_count
        FROM Contains
        WHERE product_id = product_record.product_id;
       -- AND payment_date BETWEEN start_date AND end_date;
        
        -- Retrieve the product name corresponding to the current product_id
        SELECT Product_name 
        INTO product_name1 
        FROM Product 
        WHERE Product_id = product_record.product_id;
        
        -- Insert the product details into the TOP_SOLD_BETWEEN_DATES table
        INSERT INTO TOP_SOLD_BETWEEN_DATES (product_id, product_name1, selled_quantity, starting_date, ending_date)
        VALUES (product_record.product_id, product_name1, product_order_count, start_date, end_date);
    END LOOP;
END;
$$;

CALL INSERT_INTO_TOP_SOLD_BETWEEN_DATES('2024-03-02', '2024-03-08');

select * from TOP_SOLD_BETWEEN_DATES order by selled_quantity desc;

CREATE TABLE TOP_SELLER (
 seller_id uuid,
seller_name VARCHAR(50),
sold_quantity INT,
starting_date DATE,
ending_date DATE,
CONSTRAINT FK_seller FOREIGN KEY (seller_id) REFERENCES Seller(user_id));
ALTER TABLE TOP_SELLER RENAME TO TOP_SELLER_BTWN_DATES;

DROP PROCEDURE IF EXISTS INSERT_INTO_TOP_SELLER;

-- Create or replace the procedure to insert into TOP_SELLER_BTWN_DATES
CREATE OR REPLACE PROCEDURE INSERT_INTO_TOP_SELLER_BTWN_DATES(
    start_date DATE,
    end_date DATE
)
LANGUAGE plpgsql
AS $$
DECLARE
    seller_record RECORD;
    seller_name1 VARCHAR(50);
    sold_quantity1 INT;
BEGIN
    -- Clear existing data from the TOP_SELLER_BTWN_DATES table
    DELETE FROM TOP_SELLER_BTWN_DATES;
    
    FOR seller_record IN (
        SELECT DISTINCT s.user_id AS seller_id
        FROM Contains con 
        JOIN "Order" o ON (o.order_id = con.order_id) 
        JOIN Product pro ON (con.product_id = pro.Product_id) 
        JOIN Seller s ON (s.user_id = pro.seller_id)
        WHERE o.payment_date BETWEEN start_date AND end_date
    ) LOOP
        -- Calculate total quantity of products sold by the seller between specified dates
        SELECT COALESCE(SUM(con.quantity), 0)
        INTO sold_quantity1
        FROM Contains con 
        JOIN "Order" o ON (o.order_id = con.order_id) 
        JOIN Product pro ON (con.product_id = pro.Product_id) 
        JOIN Seller s ON (s.user_id = pro.seller_id)
        WHERE o.payment_date BETWEEN start_date AND end_date AND s.user_id = seller_record.seller_id;

        -- Retrieve the seller's name
        SELECT u.First_Name 
        INTO seller_name1 
        FROM Seller s 
        JOIN Users u ON (s.user_id = u.user_id)
        WHERE s.user_id = seller_record.seller_id;
        
        -- Insert the seller's details into the TOP_SELLER_BTWN_DATES table
        INSERT INTO TOP_SELLER_BTWN_DATES (seller_id, seller_name, sold_quantity, starting_date, ending_date)
        VALUES (seller_record.seller_id, seller_name1, sold_quantity1, start_date, end_date);
    END LOOP;
END;
$$;


CALL INSERT_INTO_TOP_SELLER_BTWN_DATES('2024-03-02', '2024-03-08');

SELECT * FROM TOP_SELLER_BTWN_DATES ORDER BY sold_quantity DESC

CREATE OR REPLACE FUNCTION insert_product_category_if_not_exists()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the category already exists in Product_category table
    IF NOT EXISTS (SELECT 1 FROM Product_category WHERE Category_name = NEW.Product_category) THEN
        -- If the category doesn't exist, insert it into Product_category table
        INSERT INTO Product_category (Category_name) VALUES (NEW.Product_category) RETURNING Category_id INTO NEW.Category_id;
    ELSE
        -- If the category exists, get its Category_id
        SELECT Category_id INTO NEW.Category_id FROM Product_category WHERE Category_name = NEW.Product_category;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER insert_product_category_trigger
BEFORE INSERT ON Product
FOR EACH ROW
EXECUTE FUNCTION insert_product_category_if_not_exists();


INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Stock)
VALUES ('Organic Soap', 9.99, 'Personal Care', 'Handcrafted with organic ingredients, moisturizing, soothing fragrance', 'fb4505e6-128f-404f-816c-91937c3225b7', 50);

update product 
set stock = -5
where product_id = 2;

select * from product_category pc ;
select * from product p ;


-- Create the trigger function
CREATE OR REPLACE FUNCTION update_status_products()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.stock > 0 THEN
        NEW.status := 'Available';
    ELSIF NEW.stock = 0 THEN
        NEW.status := 'Out of stock';
    ELSE
        NEW.status := 'Restocking needed';
        NEW.stock := OLD.stock; -- Reset stock to its previous value
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_status_trigger
BEFORE INSERT OR UPDATE
ON product
FOR EACH ROW
EXECUTE FUNCTION update_status_products();

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Stock)
VALUES 
('Organic Soap', 9.99, 'Personal Care', 'Handcrafted with organic ingredients, moisturizing, soothing fragrance', 'fb4505e6-128f-404f-816c-91937c3225b7',  50),
('Laptop Bag', 39.99, 'Electronics', 'Durable polyester material, padded compartments, fits up to 15-inch laptops', 'fb4505e6-128f-404f-816c-91937c3225b7',  20),
('Stainless Steel Water Bottle', 14.99, 'Kitchen & Dining', 'Double-wall insulation, BPA-free, 20 oz capacity', 'fb4505e6-128f-404f-816c-91937c3225b7',  100),
('Cotton T-Shirt', 19.99, 'Clothing', '100% cotton, crew neck, available in various colors and sizes', 'fb4505e6-128f-404f-816c-91937c3225b7',  10),
('Wireless Bluetooth Earphones', 29.99, 'Electronics', 'True wireless design, Bluetooth 5.0, up to 20 hours playback time', 'fb4505e6-128f-404f-816c-91937c3225b7',  0);

select * from product p order by product_id desc;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_status_trigger ON Product;

-- Drop the function if exists
DROP FUNCTION IF exists update_status_products();

CREATE OR REPLACE FUNCTION update_status_products()
RETURNS TRIGGER AS
$$
BEGIN  -- Set status to 'Available' only for insert operations
    IF NEW.stock > 0 THEN
        NEW.status := 'Available';
    ELSIF NEW.stock = 0 THEN
        NEW.status := 'Out of stock';
    ELSE
        NEW.status := 'Restocking needed';
        NEW.stock := OLD.stock; -- Reset stock to its previous value
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create the trigger
CREATE TRIGGER insert_update_status_trigger_products
BEFORE INSERT OR UPDATE
ON product
FOR EACH ROW
EXECUTE FUNCTION update_status_products();

drop function update_delete_status_after_insert cascade;

CREATE OR REPLACE FUNCTION update_delete_status_after_insert()
RETURNS TRIGGER AS
$$
BEGIN
    
    NEW.delete_status := 'available';  -- Set delete_status to 'available' only for insert operations
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER insert_update_delete_status_trigger
AFTER INSERT
ON product
FOR EACH ROW
EXECUTE FUNCTION update_delete_status_after_insert();

DROP FUNCTION IF EXISTS update_delete_status_after_insert() cascade;

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_delete_status_after_insert()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.delete_status IS NULL THEN
        NEW.delete_status := 'available';  -- Replace null values with 'available'
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_delete_status_trigger
BEFORE INSERT OR UPDATE
ON product
FOR EACH ROW
EXECUTE FUNCTION update_delete_status_after_insert();

DELETE FROM Product
;

DELETE FROM Product
WHERE Product_id NOT IN (
    SELECT MIN(Product_id)
    FROM Product
    GROUP BY Product_name
);


select * from product order by product_id desc;

UPDATE Product
SET delete_status = 'available'
WHERE delete_status IS NULL;

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Stock)
VALUES 
('Organic Shampoo', 12.99, 'Personal Care', 'Sulfate-free formula, nourishing coconut oil, gentle on hair and scalp', 'fb4505e6-128f-404f-816c-91937c3225b7',  30),
('Smartphone Case', 19.99, 'Electronics', 'Slim design, shock-absorbent material, available in multiple colors', 'fb4505e6-128f-404f-816c-91937c3225b7',  15),
('Stainless Steel Mixing Bowls Set', 34.99, 'Kitchen & Dining', 'Set of 3 bowls with lids, non-slip base, dishwasher safe', 'fb4505e6-128f-404f-816c-91937c3225b7',  25),
('Denim Jeans', 29.99, 'Clothing', 'Classic straight fit, durable denim fabric, available in various washes and sizes', 'fb4505e6-128f-404f-816c-91937c3225b7',  20),
('Portable Power Bank', 24.99, 'Electronics', 'High capacity, fast charging, compatible with smartphones and tablets', 'fb4505e6-128f-404f-816c-91937c3225b7',  5),
('Herbal Tea Sampler', 16.99, 'Food & Beverages', 'Assorted herbal tea blends, caffeine-free, soothing and aromatic', 'fb4505e6-128f-404f-816c-91937c3225b7',  40),
('Yoga Mat', 22.99, 'Sports & Fitness', 'Non-slip surface, extra thick for comfort, includes carrying strap', 'fb4505e6-128f-404f-816c-91937c3225b7',  12),
('Leather Wallet', 27.99, 'Accessories', 'Genuine leather, multiple card slots, RFID blocking technology', 'fb4505e6-128f-404f-816c-91937c3225b7',  8);

select * from "Order" o join "contains" c on (o.order_id = c.order_id);
delete from "Order" o where o.order_id = 21 ;

select * from product p ;

ALTER TABLE contains DROP CONSTRAINT fk_contains_order;
ALTER TABLE contains ADD CONSTRAINT fk_contains_order FOREIGN KEY (order_id) REFERENCES "Order"(order_id) ON DELETE CASCADE;

select * from users u where user_type = 'employee' ;

SELECT 
    order_id,
    order_date,
    isConfirm,
    isPaid,
    payment_date,
    delivery_time,
    customer_id,
    delivery_status,
    delivery_date,
    pickup_date
FROM 
    "Order"
WHERE 
    delivery_status = 'Seller confirms' AND 
    (SELECT location_pst_code FROM Users WHERE user_id = customer_id) = 
    (SELECT delivery_pst_code FROM Courier_Service WHERE service_id ='1b147cfb-9341-4872-8808-d2b9b517d599' )
    ORDER BY order_id ASC;
    
   
   select * from "Order" o where ispaid = true and customer_id = '4522c13c-efaa-4f32-9227-2455050a4e37' ;
   
ALTER TABLE "Order" ADD COLUMN Rated BOOLEAN;

CREATE OR REPLACE FUNCTION set_rated_false()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.Rated := FALSE; -- Set the value of Rated to false for the new row
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER before_insert_order
BEFORE INSERT ON "Order"
FOR EACH ROW
EXECUTE FUNCTION set_rated_false();

UPDATE "Order"
SET Rated = FALSE
WHERE Rated IS NULL;

SELECT order_id, order_date, payment_date 
      FROM "Order"
      WHERE customer_id = '4522c13c-efaa-4f32-9227-2455050a4e37' AND Rated IS false and ispaid is true;
     

-- add a CONSTRAINT named rating cannot be  no more than 10 ....................... by Prachu........................		 
 CREATE TABLE Review (
    customer_id uuid,
    product_id INT,
    CONSTRAINT FK_Review_Customer FOREIGN KEY (customer_id) REFERENCES Customer(user_id),
    CONSTRAINT FK_Review_Product FOREIGN KEY (product_id) REFERENCES Product(product_id),
    CONSTRAINT PK_REVIEW PRIMARY KEY (customer_id, product_id),
    comments TEXT,
    comment_time TIMESTAMP,
    rating DECIMAL(10, 2),
    CONSTRAINT no_more_than_10 CHECK (rating <= 10)
);
-- to add into review table ..........................................
INSERT INTO Review (customer_id, product_id, comments, comment_time, rating)
VALUES 
('6487831e-30f4-44fc-8ac3-87919b1a10d3', 4, 'Great product!', CURRENT_TIMESTAMP, 9.5),
('6487831e-30f4-44fc-8ac3-87919b1a10d3', 3, 'Good service!', CURRENT_TIMESTAMP, 8.7),
('6487831e-30f4-44fc-8ac3-87919b1a10d3', 13, 'Average experience', CURRENT_TIMESTAMP, 5.2);

ALTER TABLE Contains
ADD COLUMN review TEXT,
ADD COLUMN rating DECIMAL(10, 2),
ADD COLUMN review_time TIMESTAMP;

select * from contains where order_id = 19;

select * from "Order" o ;

CREATE OR REPLACE FUNCTION update_order_rating(order_id INT) RETURNS VOID AS $$
DECLARE
    total_products INT;
    rated_products INT;
BEGIN
    -- Count the total number of products in the order
    SELECT COUNT(*) INTO total_products
    FROM Contains
    WHERE Contains.order_id = update_order_rating.order_id;

    -- Count the number of rated products in the order
    SELECT COUNT(*) INTO rated_products
    FROM Contains
    WHERE Contains.order_id = update_order_rating.order_id AND rating IS NOT NULL;

    -- Check if all products in the order have been rated
    IF total_products = rated_products THEN
        -- Update the Rated column in the Order table to true
        UPDATE "Order"
        SET Rated = TRUE
        WHERE "Order".order_id = update_order_rating.order_id;
    END IF;
END;
$$ LANGUAGE plpgsql;


select * from "Order" o where order_id = 29;
select * from contains order by order_id ;

select * from product;

ALTER TABLE Product
ADD COLUMN overall_rating DECIMAL(10, 2);

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    total_quantity_rated INT;
    calculated_rating NUMERIC(10, 2);
BEGIN
    -- Calculate the total quantity of rated products for the product
    SELECT SUM(quantity) INTO total_quantity_rated
    FROM Contains
    WHERE product_id = NEW.product_id AND rating IS NOT NULL;

    -- Calculate the overall rating using the formula
    IF total_quantity_rated IS NOT NULL THEN
        calculated_rating := (
            SELECT SUM(quantity * rating) / total_quantity_rated
            FROM Contains
            WHERE product_id = NEW.product_id AND rating IS NOT NULL
        );
    ELSE
        calculated_rating := NULL;
    END IF;

    -- Update the overall rating in the Product table
    UPDATE Product
    SET overall_rating = calculated_rating
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Create a trigger to execute the function after insert on Contains
CREATE TRIGGER update_product_rating_trigger
AFTER update ON Contains
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

select overall_rating from product p  order by product_id ;

select * from "contains" c order by product_id  ;

UPDATE Contains
SET rating = ROUND((random() * 9 + 1)::numeric, 2)
WHERE product_id IN (1, 2, 3, 4, 5, 6);

WITH RandomAdjectives AS (
    SELECT 
        adjective,
        ROW_NUMBER() OVER () AS rn
    FROM (
        VALUES 
            ('amazing'), ('awesome'), ('brilliant'), ('delightful'), ('excellent'),
            ('fantastic'), ('great'), ('incredible'), ('marvelous'), ('outstanding'),
            ('remarkable'), ('spectacular'), ('terrific'), ('wonderful'), ('splendid'),
            ('superb'), ('perfect'), ('fabulous'), ('exceptional'), ('phenomenal'),
            ('stellar'), ('impressive'), ('astounding'), ('extraordinary'), ('breathtaking'),
            ('stupendous'), ('mind-blowing'), ('jaw-dropping'), ('unbelievable'), ('unreal')
    ) AS adjectives(adjective)
)
UPDATE Contains
SET 
    rating = ROUND((random() * 9 + 1)::numeric, 2),
    review = (
        SELECT adjective || ' product!'
        FROM (
            SELECT adjective
            FROM RandomAdjectives
            ORDER BY RANDOM()
            LIMIT 1
        ) AS random_adjective
    )
WHERE product_id IN (6);

ALTER TABLE Return_Order
DROP COLUMN courier_service_id,
DROP COLUMN delivery_time,
DROP CONSTRAINT check_RETURN_STATUS;

ALTER TABLE Return_Order
ADD CONSTRAINT check_RETURN_STATUS
CHECK (status IN ('approved', 'disapproved', 'pending'));

WITH duplicates AS (
  SELECT return_id,
         ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY return_id) AS row_num
  FROM Return_Order
)
DELETE FROM Return_Order
WHERE return_id IN (
  SELECT return_id
  FROM duplicates
  WHERE row_num > 1
);
select * from return_order ro ;
        
select * from product p where overall_rating is not null;

CREATE OR REPLACE FUNCTION update_null_ratings_to_zero()
RETURNS VOID AS $$
BEGIN
    UPDATE Product
    SET overall_rating = 0
    WHERE overall_rating IS NULL;
END;
$$ LANGUAGE plpgsql;

SELECT update_null_ratings_to_zero();

select * from product p left join "contains" c  on p.product_id = c.product_id ;

CREATE OR REPLACE FUNCTION set_default_rating()
RETURNS TRIGGER AS $$
BEGIN
    NEW.overall_rating := 0;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_rating_trigger
BEFORE INSERT ON product
FOR EACH ROW
EXECUTE FUNCTION set_default_rating();

INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type) VALUES
('John', 'William', 'Doe', 'johndoe12', 'password1', '123456789', 'john.doe@example.com', '12345', 'seller'),
('Alice', 'Grace', 'Smith', 'alicesmith45', 'password2', '987654321', 'alice.smith@example.com', '12345', 'seller'),
('Bob', 'Edward', 'Johnson', 'bob.johnson78', 'password3', '456123789', 'bob.johnson@example.com', '12345', 'seller'),
('Emma', 'Rose', 'Davis', 'emma_davis', 'password4', '789456123', 'emma.davis@example.com', '12345', 'seller'),
('Michael', 'James', 'Brown', 'michael.brown123', 'password5', '321654987', 'michael.brown@example.com', '12345', 'seller'),
('Sarah', 'Elizabeth', 'Wilson', 'sarahwilson234', 'password6', '654987321', 'sarah.wilson@example.com', '12345', 'customer'),
('David', 'Alexander', 'Miller', 'davidmiller567', 'password7', '987321654', 'david.miller@example.com', '12345', 'customer'),
('Olivia', 'Marie', 'Jones', 'olivia_jones', 'password8', '159753486', 'olivia.jones@example.com', '12345', 'customer'),
('James', 'Henry', 'Taylor', 'jamestaylor123', 'password9', '753159852', 'james.taylor@example.com', '12345', 'customer'),
('Sophia', 'Anne', 'Martinez', 'sophiamartinez456', 'password10', '852369741', 'sophia.martinez@example.com', '12345', 'customer'),
('Emily', 'Catherine', 'White', 'emily_white', 'password11', '369852147', 'emily.white@example.com', '12345', 'employee'),
('William', 'Thomas', 'Anderson', 'william.anderson', 'password12', '147258369', 'william.anderson@example.com', '12345', 'employee'),
('Daniel', 'Patrick', 'Thomas', 'daniel.thomas', 'password13', '258369147', 'daniel.thomas@example.com', '12345', 'employee'),
('Ella', 'Louise', 'Harris', 'ella_harris', 'password14', '369147258', 'ella.harris@example.com', '12345', 'employee'),
('Christopher', 'Michael', 'Walker', 'christopher_walker', 'password15', '147369258', 'christopher.walker@example.com', '12345', 'employee'),
('David1', 'Andrew', 'Lee', 'davidlee123', 'password17', '456789123', 'david.lee@example.com', '12345', 'seller'),
('Sophia1', 'Sofia', 'Garcia', 'sophia_garcia', 'password18', '321987654', 'sophia.garcia@example.com', '12345', 'seller'),
('James1', 'David', 'Hernandez', 'james_hernandez', 'password19', '654321987', 'james.hernandez@example.com', '12345', 'seller'),
('Emma1', 'Jane', 'Lopez', 'emma_lopez', 'password20', '789123456', 'emma.lopez@example.com', '12345', 'seller'),
('Liam', 'Oliver', 'Taylor', 'liamtaylor123', 'password21', '123456789', 'liam.taylor@example.com', '12345', 'customer'),
('Mia', 'Grace', 'Clark', 'mia_clark', 'password22', '987654321', 'mia.clark@example.com', '12345', 'customer'),
('Noah', 'Benjamin', 'Lewis', 'noah_lewis123', 'password23', '456789123', 'noah.lewis@example.com', '12345', 'customer'),
('Ava', 'Isabella', 'Martin', 'ava_martin', 'password24', '321987654', 'ava.martin@example.com', '12345', 'customer'),
('Ethan', 'Alexander', 'Adams', 'ethan_adams', 'password25', '654321987', 'ethan.adams@example.com', '12345', 'customer');

select * from users u ;

INSERT INTO Seller (user_id, TIN, Website, factory_address, office_address) VALUES
((SELECT user_id FROM Users WHERE First_Name = 'John' and user_type = 'seller'), '1234567890', 'www.johndoe.com', '123 Factory St', '456 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Alice'and user_type = 'seller'), '9876543210', 'www.alicesmith.com', '456 Factory St', '789 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Bob'and user_type = 'seller'), '2468101214', 'www.bobjohnson.com', '789 Factory St', '012 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Emma'and user_type = 'seller'), '1357911131', 'www.emmadavis.com', '012 Factory St', '345 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Michael'and user_type = 'seller'), '1012141618', 'www.michaelbrown.com', '345 Factory St', '678 Office St');

select * from seller s ;

UPDATE Seller
SET company_name = 'John Doe Enterprises'
WHERE user_id = (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller');

UPDATE Seller
SET company_name = 'Alice Smith Co.'
WHERE user_id = (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller');

UPDATE Seller
SET company_name = 'Johnson Manufacturing'
WHERE user_id = (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller');

UPDATE Seller
SET company_name = 'Emma Davis Corporation'
WHERE user_id = (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller');

UPDATE Seller
SET company_name = 'Brown Industries'
WHERE user_id = (SELECT user_id FROM Users WHERE First_Name = 'Michael' AND user_type = 'seller');

INSERT INTO Customer (user_id)
SELECT user_id FROM Users WHERE user_type = 'customer' ;

INSERT INTO Customer (user_id)
SELECT user_id FROM Users WHERE user_type = 'customer'
ON CONFLICT (user_id) DO NOTHING;

select * from customer c ;

INSERT INTO Employee (employee_id, salary, employee_type)
SELECT user_id, 
       CASE 
           WHEN First_Name = 'Emily' and user_type = 'employee' THEN 50000.00 
           WHEN First_Name = 'William' and user_type = 'employee' THEN 60000.00 
           WHEN First_Name = 'Daniel' and user_type = 'employee' THEN 55000.00 
           WHEN First_Name = 'Christopher' and user_type = 'employee' THEN 53000.00 
       END AS salary,
       CASE 
           WHEN First_Name IN ('Emily') and user_type = 'employee' THEN 'customer_care' 
           WHEN First_Name IN ('William', 'Daniel', 'Christopher') and user_type = 'employee' THEN 'courier_service' 
       END AS employee_type
FROM Users
WHERE First_Name IN ('Emily', 'William', 'Daniel', 'Christopher')and user_type = 'employee' ;

select * from employee e ;

select * from courier_service cs ;

INSERT INTO Customer_Care (service_id)
SELECT employee_id FROM Employee WHERE employee_type = 'customer_care'
ON CONFLICT (service_id) DO NOTHING;

INSERT INTO Courier_Service (service_id, delivery_pst_code, vehicle_type, status)
SELECT employee_id, '12345', 'Van', 'Active' FROM Employee WHERE employee_type = 'courier_service'
on conflict (service_id) do nothing;
select * from courier_service cs ;

UPDATE courier_service
SET status = 'Active'
WHERE status ='active';

INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Stock)
VALUES
-- Beauty category
('Lipstick', 10.99, 'Beauty', 'Long-lasting, vibrant colors', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 100),
('Foundation', 15.50, 'Beauty', 'Even coverage, various shades', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 80),
('Mascara', 8.99, 'Beauty', 'Lengthening, volumizing formula', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 120),
('Eyeliner', 6.49, 'Beauty', 'Waterproof, smudge-proof', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 150),
('Blush', 12.99, 'Beauty', 'Natural flush, buildable coverage', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 90),
('Eye Shadow Palette', 19.99, 'Beauty', 'Assorted shades, matte and shimmer', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 70),
('Makeup Brushes Set', 25.99, 'Beauty', 'High-quality synthetic brushes', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 60),
('Facial Cleanser', 9.99, 'Beauty', 'Gentle cleansing, removes makeup', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 100),
('Moisturizing Cream', 14.50, 'Beauty', 'Hydrates and nourishes skin', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 85),
('Sunscreen Lotion', 7.99, 'Beauty', 'Broad-spectrum protection, SPF 30', (SELECT user_id FROM Users WHERE First_Name = 'John' AND user_type = 'seller'), 110),

-- Medicine category
('Pain Relief Tablets', 7.99, 'Medicine', 'Fast-acting relief from headaches and body aches', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 200),
('Antacid Syrup', 9.50, 'Medicine', 'For relief from acidity and heartburn', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 150),
('Cough Syrup', 6.99, 'Medicine', 'Soothes dry and wet coughs', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 180),
('Bandages', 4.49, 'Medicine', 'Adhesive bandages for minor cuts and scrapes', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 250),
('Antiseptic Cream', 5.99, 'Medicine', 'Prevents infection, promotes healing', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 120),
('Multivitamin Tablets', 12.99, 'Medicine', 'Daily health supplement, essential nutrients', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 100),
('Allergy Relief Tablets', 8.50, 'Medicine', 'Relieves symptoms of allergies, non-drowsy', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 150),
('Digestive Enzymes Capsules', 10.99, 'Medicine', 'Aids digestion, improves nutrient absorption', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 120),
('Cold and Flu Relief Syrup', 7.99, 'Medicine', 'Provides relief from cold and flu symptoms', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 180),
('Eye Drops', 6.49, 'Medicine', 'Relieves dry, itchy eyes, lubricating formula', (SELECT user_id FROM Users WHERE First_Name = 'Alice' AND user_type = 'seller'), 200),

-- Food category
('Rice', 20.99, 'Food', 'Long-grain, aromatic rice', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 50),
('Bread', 3.50, 'Food', 'Freshly baked whole wheat bread', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 80),
('Milk', 2.99, 'Food', 'Fresh dairy milk', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 100),
('Eggs', 4.49, 'Food', 'Farm-fresh eggs', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 120),
('Apples', 6.99, 'Food', 'Crisp and juicy apples', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 70),
('Chicken Breast', 9.99, 'Food', 'Skinless, boneless chicken breast', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 60),
('Potatoes', 3.49, 'Food', 'Fresh, versatile potatoes', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 90),
('Tomatoes', 2.99, 'Food', 'Ripe, vine-ripened tomatoes', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 110),
('Bananas', 1.99, 'Food', 'Sweet and nutritious bananas', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 130),
('Oranges', 4.99, 'Food', 'Juicy, vitamin C-rich oranges', (SELECT user_id FROM Users WHERE First_Name = 'Bob' AND user_type = 'seller'), 80),

-- Stationery category
('Notebook', 5.99, 'Stationery', 'Spiral-bound notebook, ruled pages', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 100),
('Pens', 2.50, 'Stationery', 'Ballpoint pens, assorted colors', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 150),
('Pencils', 1.99, 'Stationery', 'Wooden pencils, HB lead', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 200),
('Markers', 4.49, 'Stationery', 'Permanent markers, assorted colors', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 120),
('Eraser', 0.99, 'Stationery', 'Vinyl eraser, latex-free', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 250),
('Ruler', 1.49, 'Stationery', 'Plastic ruler, centimeter and inch markings', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 200),
('Scissors', 2.99, 'Stationery', 'Stainless steel scissors, comfortable grip', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 150),
('Glue Stick', 1.99, 'Stationery', 'Non-toxic adhesive, mess-free application', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 180),
('Highlighters', 3.49, 'Stationery', 'Fluorescent highlighters, assorted colors', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 130),
('Binder Clips', 2.50, 'Stationery', 'Metal binder clips, assorted sizes', (SELECT user_id FROM Users WHERE First_Name = 'Emma' AND user_type = 'seller'), 200);

select * from users u ;

INSERT INTO "Order" (order_date, isConfirm, isPaid, payment_date, delivery_time, customer_id, delivery_status, delivery_date, pickup_date, courier_employee_id)
VALUES
-- Order 1 'William', 'Daniel', 'Christopher'
('2024-03-01', true, true, '2024-03-01', '2024-03-01 10:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Sarah' and user_type = 'customer'), 'Courier confirmed', '2024-03-01', '2024-03-01',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'William' limit 1) ),
-- Order 2
('2024-03-02', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'David' and user_type = 'customer'), 'seller unconfirmed', NULL, NULL, NULL),
-- Order 3
('2024-03-03', true, false, NULL , NULL, (SELECT user_id FROM Users WHERE First_Name = 'Olivia' and user_type = 'customer'), 'seller unconfirmed', NULL,  NULL, NULL),
-- Order 4
('2024-03-04', true, true, '2024-03-04', '2024-03-04 11:00:00', (SELECT user_id FROM Users WHERE First_Name = 'James' and user_type = 'customer'), 'Courier confirmed', '2024-03-04', '2024-03-04',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'Daniel' limit 1) ),
-- Order 5
('2024-03-05', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'Sophia' and user_type = 'customer' limit 1), 'seller unconfirmed', NULL,NULL, NULL),
-- Order 6
('2024-03-06', true, true, '2024-03-06', '2024-03-06 12:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Sarah' and user_type = 'customer' limit 1
), 'Courier confirmed', '2024-03-06', '2024-03-06',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'William' limit 1) ),
-- Order 7
('2024-03-07', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'David' and user_type = 'customer' limit 1), 'seller unconfirmed', NULL, NULL, NULL),
-- Order 8
('2024-03-08', true, true, '2024-03-08', '2024-03-08 14:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Olivia' and user_type = 'customer' limit 1), 'Courier confirmed', '2024-03-08', '2024-03-08',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'William' limit 1) ),
-- Order 9
('2024-03-09', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'Sophia' and user_type = 'customer' limit 1), 'seller unconfirmed', NULL, NULL, NULL),
-- Order 10
('2024-03-10', true, true, '2024-03-10', '2024-03-10 15:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Olivia' and user_type = 'customer' limit 1), 'Courier confirmed', '2024-03-10', '2024-03-10',
    
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'Sophia' limit 1) );
   
select * from product;

-- Inserting data for random order_id
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 
    o.order_id, 
    p.product_id, 
    FLOOR(RANDOM() * 10) + 1, 
    (RANDOM() * 50 + 10)::numeric(10,2),
    CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
    RANDOM() * 5,
    '2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM 
    (SELECT order_id FROM "Order" ORDER BY RANDOM() LIMIT 1) AS o,
    (SELECT product_id FROM Product ORDER BY RANDOM() LIMIT 1) AS p;

-- Inserting data for random order_id
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 
    o.order_id, 
    p.product_id, 
    FLOOR(RANDOM() * 10) + 1, 
    (RANDOM() * 50 + 10)::numeric(10,2),
    CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
    RANDOM() * 5,
    '2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM 
    (SELECT order_id FROM "Order" ORDER BY RANDOM() LIMIT 1) AS o,
    (SELECT product_id FROM Product ORDER BY RANDOM() LIMIT 1) AS p;

-- Inserting data for random order_id
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 
    o.order_id, 
    p.product_id, 
    FLOOR(RANDOM() * 10) + 1, 
    (RANDOM() * 50 + 10)::numeric(10,2),
    CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
    RANDOM() * 5,
    '2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM 
    (SELECT order_id FROM "Order" ORDER BY RANDOM() LIMIT 1) AS o,
    (SELECT product_id FROM Product ORDER BY RANDOM() LIMIT 1) AS p;

-- Inserting data for random order_id
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 
    o.order_id, 
    p.product_id, 
    FLOOR(RANDOM() * 10) + 1, 
    (RANDOM() * 50 + 10)::numeric(10,2),
    CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
    RANDOM() * 5,
    '2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM 
    (SELECT order_id FROM "Order" ORDER BY RANDOM() LIMIT 1) AS o,
    (SELECT product_id FROM Product ORDER BY RANDOM() LIMIT 1) AS p;

CREATE OR REPLACE FUNCTION insertRandomData()
RETURNS VOID AS $$
DECLARE
    i INT := 1;
BEGIN
    WHILE i <= 100 LOOP
        -- Attempt to insert data for random order_id
        BEGIN
            -- Attempt to insert data
            BEGIN
                INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
                SELECT 
                    o.order_id, 
                    p.product_id, 
                    FLOOR(RANDOM() * 10) + 1, 
                    (RANDOM() * 50 + 10)::numeric(10,2),
                    CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
                    RANDOM() * 5,
                    '2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
                FROM 
                    (SELECT order_id FROM "Order" ORDER BY RANDOM() LIMIT 1) AS o,
                    (SELECT product_id FROM Product ORDER BY RANDOM() LIMIT 1) AS p;
            EXCEPTION
                WHEN others THEN
                    -- Ignore any error and continue to the next iteration
                    NULL;
            END;
        END;
        
        i := i + 1;
    END LOOP;
END;
$$ LANGUAGE PLPGSQL;


SELECT insertRandomData();

select * from contains;

select * from product p ;

SELECT p.* FROM product p
INNER JOIN contains c ON p.product_id = c.product_id

-- conatins for 2023................................
-- Inserting data for order_id = 25
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 25, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Good purchase!' ELSE 'Item arrived damaged.' END AS review,
RANDOM() * 5,
'2023-07-01'::timestamp + INTERVAL '1 month' * FLOOR(RANDOM() * 5)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 26
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 26, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
RANDOM() * 5,
'2023-07-01'::timestamp + INTERVAL '1 month' * FLOOR(RANDOM() * 5)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 27
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 27, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Excellent service!' ELSE 'Shipping was delayed.' END AS review,
RANDOM() * 5,
'2023-07-01'::timestamp + INTERVAL '1 month' * FLOOR(RANDOM() * 5)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 28
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 28, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Product as described!' ELSE 'Received wrong item.' END AS review,
RANDOM() * 5,
'2023-07-01'::timestamp + INTERVAL '1 month' * FLOOR(RANDOM() * 5)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 29
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 29, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Satisfactory!' ELSE 'Not what I expected.' END AS review,
RANDOM() * 5,
'2023-07-01'::timestamp + INTERVAL '1 month' * FLOOR(RANDOM() * 5)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 30
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 30, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Could be better!' ELSE 'Not worth the price.' END AS review,
RANDOM() * 5,
'2023-07-01'::timestamp + INTERVAL '1 month' * FLOOR(RANDOM() * 5)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

--- contains for order date 2022.........................................

-- Inserting data for order_id = 31
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 31, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
RANDOM() * 5,
'2022-07-01'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 31)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 32
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 32, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Good purchase!' ELSE 'Item arrived damaged.' END AS review,
RANDOM() * 5,
'2022-07-01'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 31)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 33
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 33, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Highly recommended!' ELSE 'Did not meet expectations.' END AS review,
RANDOM() * 5,
'2022-07-01'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 31)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 34
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 34, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Excellent service!' ELSE 'Shipping was delayed.' END AS review,
RANDOM() * 5,
'2022-07-01'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 31)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

-- Inserting data for order_id = 35
INSERT INTO Contains (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 35, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Product as described!' ELSE 'Received wrong item.' END AS review,
RANDOM() * 5,
'2022-07-01'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 31)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 2;

