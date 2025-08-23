from app import create_app

app = create_app()

# Test registration data
test_data = {
    "firstName": "Test",
    "lastName": "User",
    "email": "test2@example.com",
    "password": "password123",
    "role": "student",
    "phone": "1234567890"
}

with app.test_client() as client:
    print("Testing registration endpoint...")
    response = client.post('/api/auth/register', json=test_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.get_json()}") 