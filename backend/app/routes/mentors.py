from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Mentor, Student, Mentorship, User
from datetime import datetime

mentors_bp = Blueprint('mentors', __name__)

@mentors_bp.route('/', methods=['GET'])
def get_mentors():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        expertise = request.args.get('expertise')
        available = request.args.get('available', 'true').lower() == 'true'
        
        query = Mentor.objects
        
        if expertise:
            query = query.filter(expertise__icontains=expertise)
        
        if available:
            query = query.filter(is_available=True)
        
        total = query.count()
        mentors = query.skip((page - 1) * per_page).limit(per_page)
        
        return jsonify({
            'mentors': [mentor.to_dict() for mentor in mentors],
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mentors_bp.route('/<mentor_id>', methods=['GET'])
def get_mentor(mentor_id):
    try:
        mentor = Mentor.objects(id=mentor_id).first()
        if not mentor:
            return jsonify({'error': 'Mentor not found'}), 404
        
        return jsonify(mentor.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mentors_bp.route('/request', methods=['POST'])
@jwt_required()
def request_mentorship():
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if user.role != 'student':
            return jsonify({'error': 'Only students can request mentorship'}), 403
        
        student = Student.objects(user=user).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        
        data = request.get_json()
        
        if not data.get('mentorId'):
            return jsonify({'error': 'Mentor ID is required'}), 400
        
        mentor = Mentor.objects(id=data['mentorId']).first()
        if not mentor:
            return jsonify({'error': 'Mentor not found'}), 404
        
        if not mentor.can_accept_student():
            return jsonify({'error': 'Mentor is not available'}), 400
        
        # Check if mentorship already exists
        existing_mentorship = Mentorship.objects(
            mentor=mentor,
            student=student,
            status='pending'
        ).first()
        
        if existing_mentorship:
            return jsonify({'error': 'Mentorship request already pending'}), 400
        
        mentorship = Mentorship(
            mentor=mentor,
            student=student,
            goals=data.get('goals', ''),
            status='pending'
        )
        mentorship.save()
        
        return jsonify({
            'message': 'Mentorship request sent successfully',
            'mentorship': mentorship.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mentors_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_mentorship_requests():
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if user.role != 'mentor':
            return jsonify({'error': 'Only mentors can view requests'}), 403
        
        mentor = Mentor.objects(user=user).first()
        if not mentor:
            return jsonify({'error': 'Mentor profile not found'}), 404
        
        requests = Mentorship.objects(mentor=mentor).order_by('-created_at')
        
        return jsonify({
            'requests': [req.to_dict() for req in requests]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mentors_bp.route('/requests/<int:request_id>/respond', methods=['POST'])
@jwt_required()
def respond_to_mentorship_request(request_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if user.role != 'mentor':
            return jsonify({'error': 'Only mentors can respond to requests'}), 403
        
        mentor = Mentor.objects(user=user).first()
        if not mentor:
            return jsonify({'error': 'Mentor profile not found'}), 404
        
        mentorship = Mentorship.objects(id=request_id).first()
        
        if mentorship.mentor != mentor:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        response = data.get('response')  # 'accept' or 'reject'
        
        if response == 'accept':
            if not mentor.can_accept_student():
                return jsonify({'error': 'Cannot accept more students'}), 400
            
            mentorship.status = 'active'
            mentorship.start_date = datetime.utcnow()
            mentor.current_students += 1
            
        elif response == 'reject':
            mentorship.status = 'rejected'
        
        mentorship.save()
        
        return jsonify({
            'message': f'Mentorship request {response}ed successfully',
            'mentorship': mentorship.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mentors_bp.route('/expertise', methods=['GET'])
def get_expertise_areas():
    try:
        # Get unique expertise areas from mentors
        mentors = Mentor.objects(is_available=True)
        expertise_areas = set()
        
        for mentor in mentors:
            if mentor.expertise:
                areas = [area.strip() for area in mentor.expertise.split(',')]
                expertise_areas.update(areas)
        
        return jsonify(list(expertise_areas)), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 