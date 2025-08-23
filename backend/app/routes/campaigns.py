from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Campaign, CampaignUpdate, User, NGO
from datetime import datetime, timedelta

campaigns_bp = Blueprint('campaigns', __name__)

@campaigns_bp.route('/', methods=['GET'])
def get_campaigns():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        status = request.args.get('status', 'active')
        
        # Build query
        query = Campaign.objects
        
        # Apply filters
        if category and category != 'all':
            query = query.filter(category=category)
        
        if search:
            query = query.filter(
                title__icontains=search
            ) | query.filter(
                description__icontains=search
            )
        
        if status:
            query = query.filter(status=status)
        
        # Order by creation date
        query = query.order_by('-created_at')
        
        # Paginate
        total = query.count()
        campaigns = query.skip((page - 1) * per_page).limit(per_page)
        
        return jsonify({
            'campaigns': [campaign.to_dict() for campaign in campaigns],
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>', methods=['GET'])
def get_campaign(campaign_id):
    try:
        campaign = Campaign.objects(id=campaign_id).first()
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        # Get recent donations (we'll implement this later)
        recent_donations = []  # TODO: Implement donation query
        
        # Get campaign updates
        updates = CampaignUpdate.objects(campaign=campaign).order_by('-created_at')
        
        campaign_data = campaign.to_dict()
        campaign_data['recent_donations'] = [donation.to_dict() for donation in recent_donations]
        campaign_data['updates'] = [update.to_dict() for update in updates]
        
        return jsonify(campaign_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/', methods=['POST'])
@jwt_required()
def create_campaign():
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if user.role != 'ngo':
            return jsonify({'error': 'Only NGOs can create campaigns'}), 403
        
        ngo = NGO.objects(user=user).first()
        if not ngo:
            return jsonify({'error': 'NGO profile not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'category', 'goalAmount']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create campaign
        campaign = Campaign(
            title=data['title'],
            description=data['description'],
            long_description=data.get('longDescription', ''),
            category=data['category'],
            goal_amount=float(data['goalAmount']),
            image_url=data.get('imageUrl'),
            location=data.get('location'),
            ngo=ngo,
            end_date=datetime.utcnow() + timedelta(days=30)  # Default 30 days
        )
        campaign.save()
        
        return jsonify({
            'message': 'Campaign created successfully',
            'campaign': campaign.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>', methods=['PUT'])
@jwt_required()
def update_campaign(campaign_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if user.role != 'ngo':
            return jsonify({'error': 'Only NGOs can update campaigns'}), 403
        
        campaign = Campaign.objects(id=campaign_id).first()
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        # Check if user owns this campaign
        if campaign.ngo.user.id != current_user_id:
            return jsonify({'error': 'You can only update your own campaigns'}), 403
        
        data = request.get_json()
        
        # Update fields
        if data.get('title'):
            campaign.title = data['title']
        if data.get('description'):
            campaign.description = data['description']
        if data.get('longDescription'):
            campaign.long_description = data['longDescription']
        if data.get('category'):
            campaign.category = data['category']
        if data.get('goalAmount'):
            campaign.goal_amount = float(data['goalAmount'])
        if data.get('imageUrl'):
            campaign.image_url = data['imageUrl']
        if data.get('location'):
            campaign.location = data['location']
        if data.get('status'):
            campaign.status = data['status']
        
        campaign.save()
        
        return jsonify({
            'message': 'Campaign updated successfully',
            'campaign': campaign.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>', methods=['DELETE'])
@jwt_required()
def delete_campaign(campaign_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if user.role != 'ngo':
            return jsonify({'error': 'Only NGOs can delete campaigns'}), 403
        
        campaign = Campaign.objects(id=campaign_id).first()
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        # Check if user owns this campaign
        if campaign.ngo.user.id != current_user_id:
            return jsonify({'error': 'You can only delete your own campaigns'}), 403
        
        campaign.delete()
        
        return jsonify({'message': 'Campaign deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>/updates', methods=['POST'])
@jwt_required()
def add_campaign_update(campaign_id):
    try:
        current_user_id = get_jwt_identity()
        campaign = Campaign.objects(id=campaign_id).first()
        
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        # Check if user owns this campaign
        if campaign.ngo.user.id != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Title and content are required'}), 400
        
        update = CampaignUpdate(
            campaign=campaign,
            title=data['title'],
            content=data['content']
        )
        update.save()
        
        return jsonify({
            'message': 'Update added successfully',
            'update': update.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = [
        {'value': 'scholarship', 'label': 'Scholarships', 'icon': '🎓'},
        {'value': 'infrastructure', 'label': 'Infrastructure', 'icon': '🏗️'},
        {'value': 'mentorship', 'label': 'Mentorship', 'icon': '🤝'},
        {'value': 'education', 'label': 'Education', 'icon': '📚'}
    ]
    return jsonify(categories), 200

@campaigns_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        total_campaigns = Campaign.objects.count()
        active_campaigns = Campaign.objects(status='active').count()
        total_goal = sum(campaign.goal_amount for campaign in Campaign.objects)
        total_raised = sum(campaign.raised_amount for campaign in Campaign.objects)
        
        overall_progress = (total_raised / total_goal * 100) if total_goal > 0 else 0
        
        return jsonify({
            'total_campaigns': total_campaigns,
            'active_campaigns': active_campaigns,
            'total_goal': total_goal,
            'total_raised': total_raised,
            'overall_progress': overall_progress
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 