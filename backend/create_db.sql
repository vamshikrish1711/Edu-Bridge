-- EduBridge Database Setup Script
-- Run this script as MySQL root user

-- Create database
CREATE DATABASE IF NOT EXISTS edubridge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS 'edubridge_user'@'localhost' IDENTIFIED BY 'edubridge_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON edubridge_db.* TO 'edubridge_user'@'localhost';
GRANT ALL PRIVILEGES ON edubridge_db.* TO 'edubridge_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show created database
SHOW DATABASES;

-- Show users
SELECT User, Host FROM mysql.user WHERE User = 'edubridge_user'; 