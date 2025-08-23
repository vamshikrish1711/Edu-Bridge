from app import create_app, db
from app.models import User, Campaign, NGO
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import uuid

def seed_data():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create admin user
        admin_user = User(
            email='admin@edubridge.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            role='admin',
            phone='+91-9876543211'
        )
        db.session.add(admin_user)
        db.session.commit()
        
        # Create sample NGO
        ngo_user = User(
            email='techfoundation@example.com',
            password='password123',
            first_name='Tech',
            last_name='Foundation',
            role='ngo',
            phone='+91-9876543210'
        )
        db.session.add(ngo_user)
        db.session.commit()
        
        ngo = NGO(
            name='Tech Education Foundation',
            user_id=ngo_user.id,
            description='Empowering students through technology education',
            phone='+91-9876543210',
            address='123 Tech Street',
            city='Mumbai',
            state='Maharashtra',
            country='India',
            registration_number='TEF2024001'
        )
        db.session.add(ngo)
        db.session.commit()  # Commit NGO first
        
        # Create sample campaigns
        campaigns = [
            {
                'title': 'Computer Science Scholarship Program',
                'description': 'Supporting 50 underprivileged students to pursue computer science education with full scholarships and mentorship.',
                'category': 'scholarship',
                'goal_amount': 50000,
                'raised_amount': 35000,
                'image_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
                'location': 'Mumbai, India',
                'ngo_id': ngo.id
            },
            {
                'title': 'Rural School Infrastructure',
                'description': 'Building modern classrooms and providing educational resources for rural schools in Karnataka.',
                'category': 'infrastructure',
                'goal_amount': 75000,
                'raised_amount': 45000,
                'image_url': 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=250&fit=crop',
                'location': 'Karnataka, India',
                'ngo_id': ngo.id
            },
            {
                'title': 'Women in STEM Mentorship',
                'description': 'Connecting female students with industry professionals for career guidance and skill development.',
                'category': 'mentorship',
                'goal_amount': 25000,
                'raised_amount': 18000,
                'image_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
                'location': 'Bangalore, India',
                'ngo_id': ngo.id
            },
            {
                'title': 'Digital Literacy for Seniors',
                'description': 'Teaching digital skills to senior citizens to help them stay connected in the modern world.',
                'category': 'education',
                'goal_amount': 30000,
                'raised_amount': 22000,
                'image_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
                'location': 'Delhi, India',
                'ngo_id': ngo.id
            },
            {
                'title': 'Art & Music Education',
                'description': 'Providing art and music education to children in government schools.',
                'category': 'education',
                'goal_amount': 40000,
                'raised_amount': 28000,
                'image_url': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
                'location': 'Chennai, India',
                'ngo_id': ngo.id
            },
            {
                'title': 'Sports Equipment Drive',
                'description': 'Providing sports equipment and training to schools in rural areas.',
                'category': 'infrastructure',
                'goal_amount': 35000,
                'raised_amount': 15000,
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
                'location': 'Punjab, India',
                'ngo_id': ngo.id
            }
        ]
        
        for campaign_data in campaigns:
            # Set end date to 30 days from now
            end_date = datetime.utcnow() + timedelta(days=30)
            
            campaign = Campaign(
                title=campaign_data['title'],
                description=campaign_data['description'],
                category=campaign_data['category'],
                goal_amount=campaign_data['goal_amount'],
                raised_amount=campaign_data['raised_amount'],
                image_url=campaign_data['image_url'],
                location=campaign_data['location'],
                ngo_id=campaign_data['ngo_id'],
                end_date=end_date
            )
            db.session.add(campaign)
        
        db.session.commit()
        print("Sample data seeded successfully!")
        print("\nAdmin credentials:")
        print("Email: admin@edubridge.com")
        print("Password: admin123")
        print("\nNGO credentials:")
        print("Email: techfoundation@example.com")
        print("Password: password123")

if __name__ == '__main__':
    seed_data() 