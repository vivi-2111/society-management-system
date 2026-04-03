-- Drop tables if they exist
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE expenses CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE payments CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE members CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE admins CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

-- Create sequences for auto-incrementing IDs
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE admin_seq'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE member_seq'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE payment_seq'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE expense_seq'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

CREATE SEQUENCE admin_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE member_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE expense_seq START WITH 1 INCREMENT BY 1;

-- Creating Tables
CREATE TABLE admins (
    admin_id NUMBER DEFAULT admin_seq.NEXTVAL PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL
);

CREATE TABLE members (
    member_id NUMBER DEFAULT member_seq.NEXTVAL PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    flat_number VARCHAR2(20) NOT NULL UNIQUE,
    phone VARCHAR2(20),
    password_hash VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    payment_id NUMBER DEFAULT payment_seq.NEXTVAL PRIMARY KEY,
    member_id NUMBER NOT NULL,
    amount NUMBER(10, 2) NOT NULL,
    month_year VARCHAR2(20) NOT NULL, /* e.g., 'October 2023' or '2023-10' */
    status VARCHAR2(20) DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
    payment_date TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    expense_id NUMBER DEFAULT expense_seq.NEXTVAL PRIMARY KEY,
    category VARCHAR2(50) NOT NULL,
    amount NUMBER(10, 2) NOT NULL,
    description VARCHAR2(255),
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin (password is 'lathi123' generated with bcrypt)
INSERT INTO admins (username, password_hash) 
VALUES ('lathika', '$2b$10$VMfJJa3m.1WbohKs9W0PINTGmD.LvsX0piwyDfY3lcZJSpTI');

-- Insert sample members
INSERT INTO members (name, flat_number, phone, password_hash) VALUES ('John Doe', 'A-101', '1234567890', '$2b$10$tZ2.QZq6I4gYg6N2B1MZXuD8E5F3sXGZ4cE1HlHkJ5K5N8L9M0O6m'); -- 'member123'
INSERT INTO members (name, flat_number, phone, password_hash) VALUES ('Jane Smith', 'B-202', '0987654321', '$2b$10$tZ2.QZq6I4gYg6N2B1MZXuD8E5F3sXGZ4cE1HlHkJ5K5N8L9M0O6m'); -- 'member123'
INSERT INTO members (name, flat_number, phone, password_hash) VALUES ('Alice Johnson', 'C-305', '5551234567', '$2b$10$tZ2.QZq6I4gYg6N2B1MZXuD8E5F3sXGZ4cE1HlHkJ5K5N8L9M0O6m'); -- 'member123'

-- Insert sample payments
INSERT INTO payments (member_id, amount, month_year, status, payment_date) 
VALUES (1, 1500, '2023-10', 'paid', CURRENT_TIMESTAMP);
INSERT INTO payments (member_id, amount, month_year, status) 
VALUES (2, 1500, '2023-10', 'unpaid');
INSERT INTO payments (member_id, amount, month_year, status, payment_date) 
VALUES (3, 1750, '2023-10', 'paid', CURRENT_TIMESTAMP - 5);

-- Insert sample expenses
INSERT INTO expenses (category, amount, description) 
VALUES ('Electricity', 5000, 'Common area and elevator electricity bill');
INSERT INTO expenses (category, amount, description) 
VALUES ('Maintenance', 3000, 'Elevator repair and servicing');
INSERT INTO expenses (category, amount, description) 
VALUES ('Water', 1500, 'Municipal water supply charges');

COMMIT;
