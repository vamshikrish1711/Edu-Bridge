#!/usr/bin/env python3
"""
MongoDB Setup Script for EduBridge
This script helps you set up and test MongoDB connection
"""

import os
import sys

def setup_mongodb():
    """Set up MongoDB environment variables and test connection"""
    
    print("🚀 Setting up MongoDB for EduBridge...")
    
    # Set MongoDB environment variables
    os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/edubridge_db'
    os.environ['MONGODB_DATABASE'] = 'edubridge_db'
    os.environ['MONGODB_HOST'] = 'localhost'
    os.environ['MONGODB_PORT'] = '27017'
    
    print("✅ Environment variables set:")
    print(f"   MONGODB_URI: {os.environ['MONGODB_URI']}")
    print(f"   MONGODB_DATABASE: {os.environ['MONGODB_DATABASE']}")
    
    # Test the connection
    try:
        from app import create_app
        app = create_app()
        print("✅ Flask app created successfully with MongoDB")
        
        # Test database connection
        from app.models import User
        user_count = User.objects.count()
        print(f"✅ Database connection successful - Found {user_count} users")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def show_usage():
    """Show how to use the MongoDB setup"""
    
    print("\n📖 How to use MongoDB with EduBridge:")
    print("\n1. Set environment variables before running your app:")
    print("   export MONGODB_URI='mongodb://localhost:27017/edubridge_db'")
    print("   export MONGODB_DATABASE='edubridge_db'")
    
    print("\n2. Or create a .env file in the backend directory:")
    print("   MONGODB_URI=mongodb://localhost:27017/edubridge_db")
    print("   MONGODB_DATABASE=edubridge_db")
    
    print("\n3. Start your Flask application:")
    print("   python run.py")
    
    print("\n4. Test the API:")
    print("   curl http://localhost:5001/")
    print("   curl http://localhost:5001/api/health")
    
    print("\n5. MongoDB is running on:")
    print("   Host: localhost")
    print("   Port: 27017")
    print("   Database: edubridge_db")

if __name__ == '__main__':
    if setup_mongodb():
        print("\n🎉 MongoDB setup completed successfully!")
        show_usage()
    else:
        print("\n❌ MongoDB setup failed!")
        sys.exit(1)
