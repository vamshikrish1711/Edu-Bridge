#!/usr/bin/env python3
"""
Create Test Users Script for EduBridge
This script creates test users for each role to test the dashboards
"""

import os
from mongoengine import connect, disconnect
from app.models import User

def create_test_users():
    """Create test users for each role"""
    
    print("🚀 Creating test users for EduBridge...")
    
    # Set MongoDB environment variables
    os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/edubridge_db'
    os.environ['MONGODB_DATABASE'] = 'edubridge_db'
    
    try:
        # Connect to MongoDB
        connect(db='edubridge_db', host='mongodb://localhost:27017/edubridge_db')
        print("✅ Connected to MongoDB")
        
        # Test users data
        test_users = [
            {
                'email': 'admin@edubridge.com',
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'phone': '+91-9876543210'
            },
            {
                'email': 'student@edubridge.com',
                'password': 'student123',
                'first_name': 'Rahul',
                'last_name': 'Kumar',
                'role': 'student',
                'phone': '+91-9876543211'
            },
            {
                'email': 'mentor@edubridge.com',
                'password': 'mentor123',
                'first_name': 'Dr. Priya',
                'last_name': 'Sharma',
                'role': 'mentor',
                'phone': '+91-9876543212'
            },
            {
                'email': 'donor@edubridge.com',
                'password': 'donor123',
                'first_name': 'Rajesh',
                'last_name': 'Patel',
                'role': 'donor',
                'phone': '+91-9876543213'
            },
            {
                'email': 'ngo@edubridge.com',
                'password': 'ngo123',
                'first_name': 'EduCare',
                'last_name': 'Foundation',
                'role': 'ngo',
                'phone': '+91-9876543214'
            }
        ]
        
        created_users = []
        
        for user_data in test_users:
            try:
                # Check if user already exists
                existing_user = User.objects(email=user_data['email']).first()
                if existing_user:
                    print(f"ℹ️  User {user_data['email']} already exists")
                    created_users.append(existing_user)
                    continue
                
                # Create new user
                user = User(
                    email=user_data['email'],
                    password=user_data['password'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    role=user_data['role'],
                    phone=user_data['phone']
                )
                user.save()
                created_users.append(user)
                print(f"✅ Created user: {user_data['email']} ({user_data['role']})")
                
            except Exception as e:
                print(f"❌ Error creating user {user_data['email']}: {e}")
        
        print(f"\n🎯 Total users created/verified: {len(created_users)}")
        
        # Display all users
        print("\n📊 Current users in database:")
        all_users = User.objects.all()
        for user in all_users:
            print(f"   {user.email} - {user.role} - {user.first_name} {user.last_name}")
        
        print("\n🔑 Login Credentials:")
        print("   Admin: admin@edubridge.com / admin123")
        print("   Student: student@edubridge.com / student123")
        print("   Mentor: mentor@edubridge.com / mentor123")
        print("   Donor: donor@edubridge.com / donor123")
        print("   NGO: ngo@edubridge.com / ngo123")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    finally:
        disconnect()
        print("🔌 Disconnected from MongoDB")

if __name__ == '__main__':
    if create_test_users():
        print("\n🎉 Test users setup completed successfully!")
        print("\n💡 You can now test the dashboards by:")
        print("   1. Starting your Flask backend: python run.py")
        print("   2. Starting your React frontend: npm start")
        print("   3. Logging in with any of the test credentials above")
        print("   4. Navigating to /{role}/dashboard (e.g., /admin/dashboard)")
    else:
        print("\n❌ Test users setup failed!")
