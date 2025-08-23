from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Donation, Campaign, User
import uuid

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/', methods=['POST'])
@jwt_required()
def create_donation():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('amount') or not data.get('campaignId'):
            return jsonify({'error': 'Amount and campaign ID are required'}), 400
        
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than 0'}), 400
        
        campaign = Campaign.objects(id=data['campaignId']).first()
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        donor = User.objects(id=current_user_id).first()
        if not donor:
            return jsonify({'error': 'User not found'}), 404
        
        # Create donation
        donation = Donation(
            amount=amount,
            donor=donor,
            campaign=campaign,
            payment_method=data.get('paymentMethod', 'online'),
            transaction_id=str(uuid.uuid4()),
            status='completed',  # In real app, this would be 'pending' until payment is confirmed
            is_anonymous=data.get('isAnonymous', False),
            message=data.get('message', '')
        )
        donation.save()
        
        # Update campaign raised amount
        campaign.update_raised_amount(amount)
        
        return jsonify({
            'message': 'Donation successful',
            'donation': donation.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/campaign/<campaign_id>', methods=['GET'])
def get_campaign_donations(campaign_id):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        campaign = Campaign.objects(id=campaign_id).first()
        if not campaign:
            return jsonify({'error': 'Campaign not found'}), 404
        
        donations = Donation.objects(campaign=campaign).order_by('-created_at')
        total = donations.count()
        donations = donations.skip((page - 1) * per_page).limit(per_page)
        
        return jsonify({
            'donations': [donation.to_dict() for donation in donations],
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_donations():
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        user = User.objects(id=current_user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        donations = Donation.objects(donor=user).order_by('-created_at')
        total = donations.count()
        donations = donations.skip((page - 1) * per_page).limit(per_page)
        
        return jsonify({
            'donations': [donation.to_dict() for donation in donations],
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/stats', methods=['GET'])
def get_donation_stats():
    try:
        total_donations = Donation.objects(status='completed').count()
        total_amount = sum(donation.amount for donation in Donation.objects(status='completed'))
        
        # Get recent donations (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_donations = Donation.objects(status='completed', created_at__gte=thirty_days_ago).count()
        recent_amount = sum(donation.amount for donation in Donation.objects(status='completed', created_at__gte=thirty_days_ago))
        
        return jsonify({
            'total_donations': total_donations,
            'total_amount': total_amount,
            'recent_donations': recent_donations,
            'recent_amount': recent_amount
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 