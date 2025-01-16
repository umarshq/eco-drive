from flask import Blueprint, jsonify
from app import db
from app.models.user import User
from app.routes.auth import token_required  # Import token_required from 
bp = Blueprint('leaderboard', __name__, url_prefix='/api/leaderboard')

@bp.route('/', methods=['GET'])
@token_required
def get_community_leaderboard():
    leaderboard = User.query.order_by(User.total_emissions.desc()).limit(10).all()
    return jsonify({'top_users': [{'name': user.username, 'points': user.total_emissions} for user in leaderboard]})