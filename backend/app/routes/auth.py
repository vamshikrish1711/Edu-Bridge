from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models import User, NGO, Student, Mentor
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'firstName', 'lastName', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.objects(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        user = User(
            email=data['email'],
            password=data['password'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            role=data['role'],
            phone=data.get('phone')
        )
        user.save()
        
        # Generate tokens immediately after user is saved
        access_token, refresh_token = user.generate_tokens()
        
        # Create role-specific profile
        if data['role'] == 'ngo':
            ngo = NGO(
                name=data.get('organization', ''),
                user=user,
                description=data.get('description', ''),
                phone=data.get('phone', ''),
                address=data.get('address', ''),
                city=data.get('city', ''),
                state=data.get('state', ''),
                country=data.get('country', 'India'),
                registration_number=str(uuid.uuid4())[:8].upper()
            )
            ngo.save()
        
        elif data['role'] == 'student':
            student = Student(
                user=user,
                school=data.get('school', ''),
                grade=data.get('grade', ''),
                age=data.get('age'),
                interests=data.get('interests', ''),
                goals=data.get('goals', ''),
                background=data.get('background', ''),
                family_income=data.get('familyIncome', 'medium'),
                location=data.get('location', '')
            )
            student.save()
        
        elif data['role'] == 'mentor':
            mentor = Mentor(
                user=user,
                company=data.get('organization', ''),
                position=data.get('position', ''),
                expertise=data.get('expertise', ''),
                experience_years=data.get('experienceYears'),
                bio=data.get('bio', ''),
                linkedin_url=data.get('linkedinUrl', ''),
                github_url=data.get('githubUrl', '')
            )
            mentor.save()
        
        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.objects(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Generate tokens
        access_token, refresh_token = user.generate_tokens()
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        # In a real application, you might want to blacklist the token
        return jsonify({'message': 'Logout successful'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        profile_data = user.to_dict()
        
        # Add role-specific profile data
        if user.role == 'student':
            student = Student.objects(user=user).first()
            if student:
                profile_data['student_profile'] = student.to_dict()
        
        elif user.role == 'mentor':
            mentor = Mentor.objects(user=user).first()
            if mentor:
                profile_data['mentor_profile'] = mentor.to_dict()
        
        elif user.role == 'ngo':
            ngo = NGO.objects(user=user).first()
            if ngo:
                profile_data['ngo_profile'] = ngo.to_dict()
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 