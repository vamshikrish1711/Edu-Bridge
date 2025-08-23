from app import create_app
from app.models import User

app = create_app()

# Test registration data
test_data = {
    "firstName": "Test",
    "lastName": "User",
    "email": "test4@example.com",
    "password": "password123",
    "role": "student",
    "phone": "1234567890"
}

with app.app_context():
    print("Testing registration endpoint...")
    
    # Create user manually to debug
    user = User(
        email=test_data['email'],
        password=test_data['password'],
        first_name=test_data['firstName'],
        last_name=test_data['lastName'],
        role=test_data['role'],
        phone=test_data['phone']
    )
    
    print(f"Before save - User ID: {getattr(user, 'id', 'NO ID')}")
    print(f"Before save - User object: {user}")
    
    user.save()
    
    print(f"After save - User ID: {getattr(user, 'id', 'NO ID')}")
    print(f"After save - User object: {user}")
    print(f"After save - User ID type: {type(user.id)}")
    
    try:
        tokens = user.generate_tokens()
        print(f"Tokens generated successfully: {tokens}")
    except Exception as e:
        print(f"Error generating tokens: {e}")
        print(f"User ID in error: {getattr(user, 'id', 'NO ID')}") 