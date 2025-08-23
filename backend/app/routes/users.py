from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Student, Mentor, NGO

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
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

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update basic user info
        if data.get('firstName'):
            user.first_name = data['firstName']
        if data.get('lastName'):
            user.last_name = data['lastName']
        if data.get('phone'):
            user.phone = data['phone']
        
        user.save()
        
        # Update role-specific profile
        if user.role == 'student' and data.get('studentProfile'):
            student = Student.objects(user=user).first()
            if student:
                student_data = data['studentProfile']
                if student_data.get('school'):
                    student.school = student_data['school']
                if student_data.get('grade'):
                    student.grade = student_data['grade']
                if student_data.get('age'):
                    student.age = student_data['age']
                if student_data.get('interests'):
                    student.interests = student_data['interests']
                if student_data.get('goals'):
                    student.goals = student_data['goals']
                if student_data.get('background'):
                    student.background = student_data['background']
                if student_data.get('familyIncome'):
                    student.family_income = student_data['familyIncome']
                if student_data.get('location'):
                    student.location = student_data['location']
                student.save()
        
        elif user.role == 'mentor' and data.get('mentorProfile'):
            mentor = Mentor.objects(user=user).first()
            if mentor:
                mentor_data = data['mentorProfile']
                if mentor_data.get('company'):
                    mentor.company = mentor_data['company']
                if mentor_data.get('position'):
                    mentor.position = mentor_data['position']
                if mentor_data.get('expertise'):
                    mentor.expertise = mentor_data['expertise']
                if mentor_data.get('experienceYears'):
                    mentor.experience_years = mentor_data['experienceYears']
                if mentor_data.get('bio'):
                    mentor.bio = mentor_data['bio']
                if mentor_data.get('linkedinUrl'):
                    mentor.linkedin_url = mentor_data['linkedinUrl']
                if mentor_data.get('githubUrl'):
                    mentor.github_url = mentor_data['githubUrl']
                mentor.save()
        
        elif user.role == 'ngo' and data.get('ngoProfile'):
            ngo = NGO.objects(user=user).first()
            if ngo:
                ngo_data = data['ngoProfile']
                if ngo_data.get('name'):
                    ngo.name = ngo_data['name']
                if ngo_data.get('description'):
                    ngo.description = ngo_data['description']
                if ngo_data.get('phone'):
                    ngo.phone = ngo_data['phone']
                if ngo_data.get('address'):
                    ngo.address = ngo_data['address']
                if ngo_data.get('city'):
                    ngo.city = ngo_data['city']
                if ngo_data.get('state'):
                    ngo.state = ngo_data['state']
                if ngo_data.get('country'):
                    ngo.country = ngo_data['country']
                ngo.save()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        stats = {
            'total_donations': 0,
            'total_amount_donated': 0,
            'campaigns_created': 0,
            'students_mentored': 0
        }
        
        if user.role == 'donor':
            from app.models import Donation
            donations = Donation.query.filter_by(donor_id=user.id, status='completed').all()
            stats['total_donations'] = len(donations)
            stats['total_amount_donated'] = sum(d.amount for d in donations)
        
        elif user.role == 'ngo':
            from app.models import Campaign
            campaigns = Campaign.query.filter_by(ngo_id=user.ngo.id).all()
            stats['campaigns_created'] = len(campaigns)
        
        elif user.role == 'mentor':
            from app.models import Mentorship
            mentorships = Mentorship.query.filter_by(mentor_id=user.mentor.id).all()
            stats['students_mentored'] = len(mentorships)
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 