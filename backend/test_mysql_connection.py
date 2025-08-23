#!/usr/bin/env python3
"""
Test MySQL Connection for EduBridge
"""

import pymysql
import os

def test_mysql_connection():
    """Test MySQL connection with current configuration"""
    
    # Database configuration
    DB_HOST = os.environ.get('MYSQL_HOST') or 'localhost'
    DB_PORT = int(os.environ.get('MYSQL_PORT') or 3306)
    DB_USER = os.environ.get('MYSQL_USER') or 'edubridge_user'
    DB_PASSWORD = os.environ.get('MYSQL_PASSWORD') or 'edubridge_password'
    DB_NAME = os.environ.get('MYSQL_DATABASE') or 'edubridge_db'
    
    print("Testing MySQL connection...")
    print(f"Host: {DB_HOST}")
    print(f"Port: {DB_PORT}")
    print(f"Database: {DB_NAME}")
    print(f"User: {DB_USER}")
    
    try:
        # Try to connect as root first to create user
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user='root',
            database=DB_NAME
        )
        
        print("✅ Successfully connected as root!")
        
        with connection.cursor() as cursor:
            # Create user if it doesn't exist
            cursor.execute(f"CREATE USER IF NOT EXISTS '{DB_USER}'@'localhost' IDENTIFIED BY '{DB_PASSWORD}'")
            cursor.execute(f"GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'localhost'")
            cursor.execute(f"GRANT ALL PRIVILEGES ON {DB_NAME}.* TO '{DB_USER}'@'%'")
            cursor.execute("FLUSH PRIVILEGES")
            print(f"✅ User '{DB_USER}' created and privileges granted!")
        
        connection.close()
        
        # Now test connection with the new user
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        
        print("✅ Successfully connected with edubridge_user!")
        connection.close()
        
        print("\n🎉 MySQL setup completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTrying alternative approach...")
        
        # Try connecting without password
        try:
            connection = pymysql.connect(
                host=DB_HOST,
                port=DB_PORT,
                user='root',
                database=DB_NAME
            )
            print("✅ Connected as root without password!")
            connection.close()
        except Exception as e2:
            print(f"❌ Alternative connection failed: {e2}")

if __name__ == "__main__":
    test_mysql_connection() 