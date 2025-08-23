#!/usr/bin/env python3
"""
Test MongoDB Connection for EduBridge
"""

import os
from pymongo import MongoClient
from mongoengine import connect, disconnect

def test_mongodb_connection():
    """Test MongoDB connection with current configuration"""
    
    # Database configuration
    MONGODB_HOST = os.environ.get('MONGODB_HOST') or 'localhost'
    MONGODB_PORT = int(os.environ.get('MONGODB_PORT') or 27017)
    MONGODB_DATABASE = os.environ.get('MONGODB_DATABASE') or 'edubridge_db'
    MONGODB_USERNAME = os.environ.get('MONGODB_USERNAME')
    MONGODB_PASSWORD = os.environ.get('MONGODB_PASSWORD')
    
    print("Testing MongoDB connection...")
    print(f"Host: {MONGODB_HOST}")
    print(f"Port: {MONGODB_PORT}")
    print(f"Database: {MONGODB_DATABASE}")
    
    try:
        # Test with PyMongo first
        if MONGODB_USERNAME and MONGODB_PASSWORD:
            client = MongoClient(
                host=MONGODB_HOST,
                port=MONGODB_PORT,
                username=MONGODB_USERNAME,
                password=MONGODB_PASSWORD,
                authSource='admin'
            )
        else:
            client = MongoClient(host=MONGODB_HOST, port=MONGODB_PORT)
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected with PyMongo!")
        
        # List databases
        databases = client.list_database_names()
        print(f"Available databases: {databases}")
        
        # Test database access
        db = client[MONGODB_DATABASE]
        collections = db.list_collection_names()
        print(f"Collections in {MONGODB_DATABASE}: {collections}")
        
        client.close()
        
        # Test with MongoEngine
        if MONGODB_USERNAME and MONGODB_PASSWORD:
            uri = f'mongodb://{MONGODB_USERNAME}:{MONGODB_PASSWORD}@{MONGODB_HOST}:{MONGODB_PORT}/{MONGODB_DATABASE}?authSource=admin'
        else:
            uri = f'mongodb://{MONGODB_HOST}:{MONGODB_PORT}/{MONGODB_DATABASE}'
        
        connect(db=MONGODB_DATABASE, host=uri)
        print("✅ Successfully connected with MongoEngine!")
        
        # Test basic operations
        from app.models import User
        user_count = User.objects.count()
        print(f"Current user count: {user_count}")
        
        disconnect()
        print("\n🎉 MongoDB setup completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure MongoDB server is running")
        print("2. Check if MongoDB is accessible on the specified host and port")
        print("3. Verify authentication credentials if using authentication")
        print("4. Try connecting without authentication first")

if __name__ == "__main__":
    test_mongodb_connection() 