# app/routes/community_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Commute
from app import db

bp = Blueprint('commute', __name__)

@bp.route('/community/leaderboard', methods=['GET'])
@jwt_required()
def get_leaderboard():
    community_id = request.args.get('communityId')
    leaderboard = db.session.query(
        User,
        func.sum(Commute.carbon_footprint).label('total_carbon')
    ).join(Commute).group_by(User.id).order_by('total_carbon').all()
    return jsonify([{
        'userId': user.id,
        'name': user.name,
        'carbonFootprint': total_carbon
    } for user, total_carbon in leaderboard])

@bp.route('/community/invite', methods=['POST'])
@jwt_required()
def invite_member():
    data = request.get_json()
    # Send invitation email and create pending invitation
    return jsonify({'message': 'Invitation sent'})