#!/usr/bin/env python3
"""
Clear Database Script for EduBridge
This script clears all data from the MongoDB database
"""

import os
from mongoengine import connect, disconnect

def clear_database():
    """Clear all data from the MongoDB database"""
    
    print("🗑️  Clearing EduBridge database...")
    
    # Set MongoDB environment variables
    os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/edubridge_db'
    os.environ['MONGODB_DATABASE'] = 'edubridge_db'
    
    try:
        # Connect to MongoDB
        connect(db='edubridge_db', host='mongodb://localhost:27017/edubridge_db')
        print("✅ Connected to MongoDB")
        
        # Import models to access collections
        from app.models import User, Campaign, CampaignUpdate, Donation, Mentor, Mentorship, Student, ScholarshipApplication, NGO
        
        # Clear all collections
        collections_to_clear = [
            ('users', User),
            ('campaigns', Campaign),
            ('campaign_updates', CampaignUpdate),
            ('donations', Donation),
            ('mentors', Mentor),
            ('mentorships', Mentorship),
            ('students', Student),
            ('scholarship_applications', ScholarshipApplication),
            ('ngos', NGO)
        ]
        
        total_deleted = 0
        
        for collection_name, model_class in collections_to_clear:
            try:
                count = model_class.objects.count()
                if count > 0:
                    model_class.objects.delete()
                    print(f"🗑️  Deleted {count} documents from {collection_name}")
                    total_deleted += count
                else:
                    print(f"ℹ️  No documents in {collection_name}")
            except Exception as e:
                print(f"⚠️  Error clearing {collection_name}: {e}")
        
        print(f"\n🎯 Total documents deleted: {total_deleted}")
        print("✅ Database cleared successfully!")
        
        # Verify all collections are empty
        print("\n📊 Verification - Current document counts:")
        for collection_name, model_class in collections_to_clear:
            try:
                count = model_class.objects.count()
                print(f"   {collection_name}: {count} documents")
            except Exception as e:
                print(f"   {collection_name}: Error - {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    finally:
        disconnect()
        print("🔌 Disconnected from MongoDB")

if __name__ == '__main__':
    if clear_database():
        print("\n🎉 Database clearing completed successfully!")
    else:
        print("\n❌ Database clearing failed!")
