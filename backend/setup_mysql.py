#!/usr/bin/env python3
"""
MySQL Database Setup Script for EduBridge
This script helps set up the MySQL database and user for the EduBridge application.
"""

import mysql.connector
from mysql.connector import Error
import os

def setup_mysql_database():
    """Set up MySQL database and user for EduBridge"""
    
    # Database configuration
    DB_HOST = os.environ.get('MYSQL_HOST') or 'localhost'
    DB_PORT = int(os.environ.get('MYSQL_PORT') or 3306)
    DB_USER = os.environ.get('MYSQL_USER') or 'edubridge_user'
    DB_PASSWORD = os.environ.get('MYSQL_PASSWORD') or 'edubridge_password'
    DB_NAME = os.environ.get('MYSQL_DATABASE') or 'edubridge_db'
    
    # Root credentials (you'll need to provide these)
    ROOT_USER = input("Enter MySQL root username (default: root): ").strip() or 'root'
    ROOT_PASSWORD = input("Enter MySQL root password (or press Enter if no password): ").strip()
    
    connection = None
    try:
        # Connect to MySQL as root
        if ROOT_PASSWORD:
            connection = mysql.connector.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=ROOT_USER,
                password=ROOT_PASSWORD
            )
        else:
            connection = mysql.connector.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=ROOT_USER
            )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ Database '{DB_NAME}' created successfully")
            
            # Create user if it doesn't exist
            cursor.execute(f"CREATE USER IF NOT EXISTS '{DB_USER}'@'localhost' IDENTIFIED BY '{DB_PASSWORD}'")
            print(f"✅ User '{DB_USER}' created successfully")
            
            # Grant privileges to the user
            cursor.execute(f"GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'localhost'")
            cursor.execute(f"GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'%'")
            cursor.execute("FLUSH PRIVILEGES")
            print(f"✅ Privileges granted to user '{DB_USER}'")
            
            print("\n🎉 MySQL setup completed successfully!")
            print(f"\nDatabase Configuration:")
            print(f"Host: {DB_HOST}")
            print(f"Port: {DB_PORT}")
            print(f"Database: {DB_NAME}")
            print(f"User: {DB_USER}")
            print(f"Password: {DB_PASSWORD}")
            
    except Error as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure MySQL server is running")
        print("2. Verify root credentials")
        print("3. Check if MySQL is accessible on the specified host and port")
        print("4. Try connecting without password if you haven't set one")
        
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    print("🚀 EduBridge MySQL Database Setup")
    print("=" * 40)
    setup_mysql_database() 