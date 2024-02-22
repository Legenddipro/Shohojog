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
    seller_id uuid NOT NULL,
		Category_id INT NOT NULL,
		Status VARCHAR(255),
		CONSTRAINT NO_NEGATIVE_price CHECK(Price >= 0),
	--	CONSTRAINT STATUS_CHECK CHECK(Status is in ('upcoming','in stock','stock out')),
	CONSTRAINT STATUS_CHECK CHECK (Status = 'upcoming' OR Status = 'in stock' OR Status = 'stock out') ,
		CONSTRAINT Category_product FOREIGN KEY (Category_id) REFERENCES Product_category(Category_id),
   CONSTRAINT fk_seller_product FOREIGN KEY (seller_id) REFERENCES Seller(user_id)
);
ALTER TABLE 
INSERT INTO public."location" (pst_code, street, area, town)
VALUES ('12345', 'Main Street', 'Downtown', 'Cityville');
INSERT INTO public."location" (pst_code, street, area, town)
VALUES ('54321', 'Oak Avenue', 'Suburbia', 'Townsville');
INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type)
VALUES ('Alice', 'Grace', 'Johnson', 'alice_grace456', 'StrongPassword789', '+9876543210', 'alice.johnson@example.com', '54321', 'employee');

INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type)
VALUES ('Bob', 'Robert', 'Smith', 'bob_smith123', 'SecurePass456', '+1234567890', 'bob.smith@example.com', '12345', 'customer');

INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type)
VALUES ('Eva', 'Marie', 'Anderson', 'eva_anderson789', 'SuperSecret789', '+9876543210', 'eva.anderson@example.com', '12345', 'seller');

INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type)
VALUES ('Jackie', 'Grace', 'Johnson', 'jackie_grace456', 'StrongPass123', '+9876543210', 'jackie.johnson@example.com', '54321', 'employee');

INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type)
VALUES ('Sophia', 'Grace', 'Taylor', 'sophia_taylor789', 'SecurePass123', '+1234567890', 'sophia.taylor@example.com', '12345', 'customer');

INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type)
VALUES ('Daniel', 'Joseph', 'Williams', 'daniel_williams456', 'StrongPass789', '+9876543210', 'daniel.williams@example.com', '12345', 'employee');

INSERT INTO Users (First_Name, Middle_Name, Last_Name, user_name, user_password, contact_no, e_mail, location_pst_code, user_type)
VALUES ('Alex', 'James', 'Roberts', 'alex_roberts123', 'SecurePass457', '+1234567890', 'alex.roberts@example.com', '12345', 'customer');
INSERT INTO Seller (user_id,TIN, Website, factory_address, office_address)
VALUES ('e53d209c-0e1d-4b6e-a670-96aa2d2ad94b','TIN_value_1', 'website_1.com', 'Factory address 1', 'Office address 1');
ALTER TABLE Product
ADD COLUMN product_image VARCHAR(255);
INSERT INTO product_category (category_name)VALUES ('Laptop');
INSERT INTO product_category (category_name)VALUES ('Tech Haven');
INSERT INTO PRODUCT VALUES ('1000000002', 'LAPTOP', 'Model: IdeaPad Slim 3i
Processor: Intel Celeron N4020 (4M Cache, 1.10 GHz up to 2.80 GHz)
Ram: 4GB DDR4, Storage: 1TB HDD
Display: 15.6" HD (1366 x 768)', '17', '70000', '3.9', '1000000008', 'Lenovo IdeaPad Slim 3i Intel Celeron N4020 15.6" HD Laptop', '1000000002.jpg');
INSERT INTO Product (Product_name, Price, Product_category, Product_features, seller_id, Category_id, Status, product_image)
VALUES 
INSERT INTO Product (Product_name, Price, Product_category, Product_features, seller_id, Category_id, Status, product_image)
VALUES ('Laptop Model A', 999.99, 'laptop', 'Feature 1','e53d209c-0e1d-4b6e-a670-96aa2d2ad94b',1,'in stock','1.jpg');
INSERT INTO Product (Product_name, Price, Product_category, Product_features, seller_id, Category_id, Status, product_image)
VALUES ('Laptop Model B', 998.99, 'laptop', 'Feature 1','e53d209c-0e1d-4b6e-a670-96aa2d2ad94b',1,'in stock','2.jpg');
SELECT * FROM Product WHERE status = 'in stock';
INSERT INTO Product (Product_name, Price, Product_category, Product_features, seller_id, Category_id, Status) 
VALUES 
('Smartphone XYZ', 699.99, 'Tech Haven', '5G compatible, 128GB storage, 6.7" display', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'in stock'),
('Wireless Earbuds', 99.99, 'Tech Haven', 'Bluetooth 5.0, Noise Cancelling, Sweatproof', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'in stock'),
('Smart Watch', 249.99, 'Tech Haven', 'Heart rate monitor, GPS, Water-resistant', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'in stock');
INSERT INTO Product (Product_name, Price, Product_category, Product_features, seller_id, Category_id, Status) 
VALUES 
('Gaming Mouse', 49.99, 'Tech Haven', 'RGB lighting, 16000 DPI, Programmable buttons', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'in stock'),
('Wireless Keyboard', 79.99, 'Tech Haven', 'Mechanical switches, Backlit keys, Long battery life', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'in stock'),
('Portable SSD Drive', 149.99, 'Tech Haven', '1TB storage, USB 3.2, Shock-resistant', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'stock out'),
('VR Headset', 299.99, 'Tech Haven', 'Wireless connectivity, High-resolution display, Motion tracking', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'upcoming');

--('Laptop ABC', 1299.99, 'Tech Haven', 'Intel Core i7, 16GB RAM, 512GB SSD', 'e53d209c-0e1d-4b6e-a670-96aa2d2ad94b', 3, 'in stock'),