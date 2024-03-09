--- eta user table er jonno .........................

-- Insert data into the Users table
INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type) VALUES
('John', NULL, 'Doe', 'johndoe12', 'password1', '123456789', 'john.doe@example.com', '12345', 'seller'),
('Alice', NULL, 'Smith', 'alicesmith45', 'password2', '987654321', 'alice.smith@example.com', '12345', 'seller'),
('Bob', 'Robert', 'Johnson', 'bob.johnson78', 'password3', '456123789', 'bob.johnson@example.com', '12345', 'seller'),
('Emma', NULL, 'Davis', 'emma_davis', 'password4', '789456123', 'emma.davis@example.com', '12345', 'seller'),
('Michael', NULL, 'Brown', 'michael.brown123', 'password5', '321654987', 'michael.brown@example.com', '12345', 'seller'),
('Sarah', NULL, 'Wilson', 'sarahwilson234', 'password6', '654987321', 'sarah.wilson@example.com', '12345', 'customer'),
('David', NULL, 'Miller', 'davidmiller567', 'password7', '987321654', 'david.miller@example.com', '12345', 'customer'),
('Olivia', NULL, 'Jones', 'olivia_jones', 'password8', '159753486', 'olivia.jones@example.com', '12345', 'customer'),
('James', NULL, 'Taylor', 'jamestaylor123', 'password9', '753159852', 'james.taylor@example.com', '12345', 'customer'),
('Sophia', NULL, 'Martinez', 'sophiamartinez456', 'password10', '852369741', 'sophia.martinez@example.com', '12345', 'customer'),
('Emily', NULL, 'White', 'emily_white', 'password11', '369852147', 'emily.white@example.com', '12345', 'employee'),
('William', NULL, 'Anderson', 'william.anderson', 'password12', '147258369', 'william.anderson@example.com', '12345', 'employee'),
('Daniel', NULL, 'Thomas', 'daniel.thomas', 'password13', '258369147', 'daniel.thomas@example.com', '12345', 'employee'),
('Ella', NULL, 'Harris', 'ella_harris', 'password14', '369147258', 'ella.harris@example.com', '12345', 'employee'),
('Christopher', NULL, 'Walker', 'christopher_walker', 'password15', '147369258', 'christopher.walker@example.com', '12345', 'employee'),
('David1', NULL, 'Lee', 'davidlee123', 'password17', '456789123', 'david.lee@example.com', '12345', 'seller'),
('Sophia1', NULL, 'Garcia', 'sophia_garcia', 'password18', '321987654', 'sophia.garcia@example.com', '12345', 'seller'),
('James1', NULL, 'Hernandez', 'james_hernandez', 'password19', '654321987', 'james.hernandez@example.com', '12345', 'seller'),
('Emma1', NULL, 'Lopez', 'emma_lopez', 'password20', '789123456', 'emma.lopez@example.com', '12345', 'seller'),('Liam', NULL, 'Taylor', 'liamtaylor123', 'password21', '123456789', 'liam.taylor@example.com', '12345', 'customer'),
('Mia', NULL, 'Clark', 'mia_clark', 'password22', '987654321', 'mia.clark@example.com', '12345', 'customer'),
('Noah', NULL, 'Lewis', 'noah_lewis123', 'password23', '456789123', 'noah.lewis@example.com', '12345', 'customer'),
('Ava', NULL, 'Martin', 'ava_martin', 'password24', '321987654', 'ava.martin@example.com', '12345', 'customer'),
('Ethan', NULL, 'Adams', 'ethan_adams', 'password25', '654321987', 'ethan.adams@example.com', '12345', 'customer');


---
-- Insert data into the Seller table with a subquery
INSERT INTO Seller (user_id, TIN, Website, factory_address, office_address) VALUES
((SELECT user_id FROM Users WHERE First_Name = 'John'), '1234567890', 'www.johndoe.com', '123 Factory St', '456 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Alice'), '9876543210', 'www.alicesmith.com', '456 Factory St', '789 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Bob'), '2468101214', 'www.bobjohnson.com', '789 Factory St', '012 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Emma'), '1357911131', 'www.emmadavis.com', '012 Factory St', '345 Office St'),
((SELECT user_id FROM Users WHERE First_Name = 'Michael'), '1012141618', 'www.michaelbrown.com', '345 Factory St', '678 Office St');
-- insert into customer table :
-- ETA LIKLE SOB CUSTOMER INSERT HOYE JABE BUT TRY KORIS JEGULO CUSTOMER TABLE E ALREADY ACHE SEGULO BAD DIYE KORTE 
INSERT INTO Customer (user_id)
SELECT user_id FROM Users WHERE user_type = 'customer' ;

--- to insert into employee table and courier_service and customer_care table ..............
-- Insert data into the Employee table
INSERT INTO Employee (employee_id, salary, employee_type)
SELECT user_id, 
       CASE 
           WHEN First_Name = 'Emily' THEN 50000.00 
           WHEN First_Name = 'William' THEN 60000.00 
           WHEN First_Name = 'Daniel' THEN 55000.00 
           WHEN First_Name = 'Christopher' THEN 53000.00 
       END AS salary,
       CASE 
           WHEN First_Name IN ('Emily') THEN 'customer_care' 
           WHEN First_Name IN ('William', 'Daniel', 'Christopher') THEN 'courier_service' 
       END AS employee_type
FROM Users
WHERE First_Name IN ('Emily', 'William', 'Daniel', 'Christopher');

-- Insert data into the Customer_Care table
--ETA LIKLE SOB CUSTOMER INSERT HOYE JABE BUT TRY KORIS JEGULO CUSTOMER TABLE E ALREADY ACHE SEGULO BAD DIYE KORTE ...............
INSERT INTO Customer_Care (service_id)
SELECT employee_id FROM Employee WHERE employee_type = 'customer_care';

-- Insert data into the Courier_Service table
--ETA LIKLE SOB CUSTOMER INSERT HOYE JABE BUT TRY KORIS JEGULO CUSTOMER TABLE E ALREADY ACHE SEGULO BAD DIYE KORTE 
INSERT INTO Courier_Service (service_id, delivery_pst_code, vehicle_type, status)
SELECT employee_id, '12345', 'Van', 'Active' FROM Employee WHERE employee_type = 'courier_service';

--DELETE FROM Courier_Service;
INSERT INTO Product_category (Category_name) VALUES
('Food'),
('Stationary');
UPDATE product_category SET category_name ='Food' WHERE category_id = 5;
UPDATE product_category SET category_name ='Stationery' WHERE category_id = 6;
-- The categories are Electronics , Beauty, Food ,Stationary, Medicine.......................................


INSERT INTO Product (Product_name, Price, Product_category, Product_features, Seller_id, Category_id, Stock, status)
VALUES
-- Beauty category
('Lipstick', 10.99, 'Beauty', 'Long-lasting, vibrant colors', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 100, 'available'),
('Foundation', 15.50, 'Beauty', 'Even coverage, various shades', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 80, 'available'),
('Mascara', 8.99, 'Beauty', 'Lengthening, volumizing formula', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 120, 'available'),
('Eyeliner', 6.49, 'Beauty', 'Waterproof, smudge-proof', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 150, 'available'),
('Blush', 12.99, 'Beauty', 'Natural flush, buildable coverage', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 90, 'available'),
('Eye Shadow Palette', 19.99, 'Beauty', 'Assorted shades, matte and shimmer', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 70, 'available'),
('Makeup Brushes Set', 25.99, 'Beauty', 'High-quality synthetic brushes', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 60, 'available'),
('Facial Cleanser', 9.99, 'Beauty', 'Gentle cleansing, removes makeup', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 100, 'available'),
('Moisturizing Cream', 14.50, 'Beauty', 'Hydrates and nourishes skin', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 85, 'available'),
('Sunscreen Lotion', 7.99, 'Beauty', 'Broad-spectrum protection, SPF 30', (SELECT user_id FROM Users WHERE First_Name = 'John'), (SELECT Category_id FROM product_category WHERE Category_name = 'Beauty'), 110, 'available'),

-- Medicine category
('Pain Relief Tablets', 7.99, 'Medicine', 'Fast-acting relief from headaches and body aches', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 200, 'available'),
('Antacid Syrup', 9.50, 'Medicine', 'For relief from acidity and heartburn', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 150, 'available'),
('Cough Syrup', 6.99, 'Medicine', 'Soothes dry and wet coughs', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 180, 'available'),
('Bandages', 4.49, 'Medicine', 'Adhesive bandages for minor cuts and scrapes', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 250, 'available'),
('Antiseptic Cream', 5.99, 'Medicine', 'Prevents infection, promotes healing', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 120, 'available'),
('Multivitamin Tablets', 12.99, 'Medicine', 'Daily health supplement, essential nutrients', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 100, 'available'),
('Allergy Relief Tablets', 8.50, 'Medicine', 'Relieves symptoms of allergies, non-drowsy', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 150, 'available'),
('Digestive Enzymes Capsules', 10.99, 'Medicine', 'Aids digestion, improves nutrient absorption', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 120, 'available'),
('Cold and Flu Relief Syrup', 7.99, 'Medicine', 'Provides relief from cold and flu symptoms', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 180, 'available'),
('Eye Drops', 6.49, 'Medicine', 'Relieves dry, itchy eyes, lubricating formula', (SELECT user_id FROM Users WHERE First_Name = 'Alice'), (SELECT Category_id FROM product_category WHERE Category_name = 'Medicine'), 200, 'available'),

-- Food category
('Rice', 20.99, 'Food', 'Long-grain, aromatic rice', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 50, 'available'),
('Bread', 3.50, 'Food', 'Freshly baked whole wheat bread', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 80, 'available'),
('Milk', 2.99, 'Food', 'Fresh dairy milk', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 100, 'available'),
('Eggs', 4.49, 'Food', 'Farm-fresh eggs', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 120, 'available'),
('Apples', 6.99, 'Food', 'Crisp and juicy apples', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 70, 'available'),
('Chicken Breast', 9.99, 'Food', 'Skinless, boneless chicken breast', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 60, 'available'),
('Potatoes', 3.49, 'Food', 'Fresh, versatile potatoes', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 90, 'available'),
('Tomatoes', 2.99, 'Food', 'Ripe, vine-ripened tomatoes', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 110, 'available'),
('Bananas', 1.99, 'Food', 'Sweet and nutritious bananas', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 130, 'available'),
('Oranges', 4.99, 'Food', 'Juicy, vitamin C-rich oranges', (SELECT user_id FROM Users WHERE First_Name = 'Bob'), (SELECT Category_id FROM product_category WHERE Category_name = 'Food'), 80, 'available'),

-- Stationery category
('Notebook', 5.99, 'Stationery', 'Spiral-bound notebook, ruled pages', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 100, 'available'),
('Pens', 2.50, 'Stationery', 'Ballpoint pens, assorted colors', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 150, 'available'),
('Pencils', 1.99, 'Stationery', 'Wooden pencils, HB lead', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 200, 'available'),
('Markers', 4.49, 'Stationery', 'Permanent markers, assorted colors', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 120, 'available'),
('Eraser', 0.99, 'Stationery', 'Vinyl eraser, latex-free', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 250, 'available'),
('Ruler', 1.49, 'Stationery', 'Plastic ruler, centimeter and inch markings', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 200, 'available'),
('Scissors', 2.99, 'Stationery', 'Stainless steel scissors, comfortable grip', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 150, 'available'),
('Glue Stick', 1.99, 'Stationery', 'Non-toxic adhesive, mess-free application', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 180, 'available'),
('Highlighters', 3.49, 'Stationery', 'Fluorescent highlighters, assorted colors', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 130, 'available'),
('Binder Clips', 2.50, 'Stationery', 'Metal binder clips, assorted sizes', (SELECT user_id FROM Users WHERE First_Name = 'Emma'), (SELECT Category_id FROM product_category WHERE Category_name = 'Stationery'), 200, 'available');

 
 
---- insert into order 
-- Insert data into the Order table
-- Insert data into the Order table
INSERT INTO "Order" (order_date, isConfirm, isPaid, payment_date, delivery_time, customer_id, delivery_status, delivery_date, pickup_date, courier_employee_id)
VALUES
-- Order 1 'William', 'Daniel', 'Christopher'
('2024-03-01', true, true, '2024-03-01', '2024-03-01 10:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Sarah'), 'Courier confirmed', '2024-03-01', '2024-03-01',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'William')),
-- Order 2
('2024-03-02', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'David'), 'seller unconfirmed', NULL, NULL, NULL),
-- Order 3
('2024-03-03', true, false, NULL , NULL, (SELECT user_id FROM Users WHERE First_Name = 'Olivia'), 'seller unconfirmed', NULL,  NULL, NULL),
-- Order 4
('2024-03-04', true, true, '2024-03-04', '2024-03-04 11:00:00', (SELECT user_id FROM Users WHERE First_Name = 'James'), 'Courier confirmed', '2024-03-04', '2024-03-04',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'Daniel')),
-- Order 5
('2024-03-05', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'Sophia'), 'seller unconfirmed', NULL,NULL, NULL),
-- Order 6
('2024-03-06', true, true, '2024-03-06', '2024-03-06 12:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Sarah'
), 'Courier confirmed', '2024-03-06', '2024-03-06',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'William')),
-- Order 7
('2024-03-07', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'David'), 'seller unconfirmed', NULL, NULL, NULL),
-- Order 8
('2024-03-08', true, true, '2024-03-08', '2024-03-08 14:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Olivia'), 'Courier confirmed', '2024-03-08', '2024-03-08',
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'William')),
-- Order 9
('2024-03-09', true, false, NULL, NULL, (SELECT user_id FROM Users WHERE First_Name = 'Sophia'), 'seller unconfirmed', NULL, NULL, NULL),
-- Order 10
('2024-03-10', true, true, '2024-03-10', '2024-03-10 15:00:00', (SELECT user_id FROM Users WHERE First_Name = 'Olivia'), 'Courier confirmed', '2024-03-10', '2024-03-10',
    
    (SELECT service_id FROM Courier_Service 
    JOIN Employee ON Courier_Service.service_id = Employee.employee_id 
    JOIN Users ON Employee.employee_id = Users.user_id 
    WHERE Users.First_Name = 'Sophia'));

		
		DELETE FROM product;
		DELETE FROM "Contains";
		DELETE FROM "Order";
		DELETE FROM top_selled;
		DELETE FROM top_sold_between_dates;
		DELETE FROM customer_care;
		DELETE FROM courier_service;
		DELETE FROM employee;
		DELETE FROM customer;
		DELETE FROM seller;
		DELETE FROM top_seller;
		DELETE FROM users;
	ALTER TABLE Product
ADD COLUMN status VARCHAR(50);

CREATE TABLE "Contains" (
    order_id INT,
    product_id INT,
    CONSTRAINT fk_contains_order FOREIGN KEY (order_id) REFERENCES "Order"(order_id) ON DELETE CASCADE,
    CONSTRAINT FK_CONTAINS_PRODUCT FOREIGN KEY (product_id) REFERENCES Product (product_id),
    CONSTRAINT PK_CONTAINS PRIMARY KEY (order_id, product_id),
    quantity INT,
    price DECIMAL(10, 2),
    CONSTRAINT NO_NEGATIVE_QUANTITY CHECK(quantity > 0),
    CONSTRAINT NO_NEGATIVE_PRICE CHECK(price >= 0),
    review TEXT,
    rating DECIMAL(10, 2),
    review_time TIMESTAMP
);

-- Inserting data for order_id = 16
INSERT INTO "Contains" (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 16, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Great product!' ELSE 'Not satisfied with the quality.' END AS review,
RANDOM() * 5,
'2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 5;

-- Inserting data for order_id = 19
INSERT INTO "Contains" (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 19, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Good purchase!' ELSE 'Item arrived damaged.' END AS review,
RANDOM() * 5,
'2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 5;

-- Inserting data for order_id = 21
INSERT INTO "Contains" (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 21, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Highly recommended!' ELSE 'Did not meet expectations.' END AS review,
RANDOM() * 5,
'2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 5;

-- Inserting data for order_id = 23
INSERT INTO "Contains" (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 23, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Excellent service!' ELSE 'Shipping was delayed.' END AS review,
RANDOM() * 5,
'2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 5;

-- Inserting data for order_id = 25
INSERT INTO "Contains" (order_id, product_id, quantity, price, review, rating, review_time)
SELECT 25, product_id, FLOOR(RANDOM() * 10) + 1, (RANDOM() * 50 + 10)::numeric(10,2),
CASE WHEN RANDOM() < 0.5 THEN 'Product as described!' ELSE 'Received wrong item.' END AS review,
RANDOM() * 5,
'2024-03-11'::timestamp + INTERVAL '1 day' * FLOOR(RANDOM() * 20)
FROM Product
WHERE product_id BETWEEN 34 AND 70
LIMIT 5;

