from flask import Blueprint, jsonify
from app import db
from app.models.user import User
from app.routes.auth import token_required  # Import token_required from 
bp = Blueprint('user_dashboard', __name__)

@bp.route('/user_stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    user_stats = {
        "total_distance": current_user.total_distance,
        "total_emissions": current_user.total_emissions,
        "achievements": [a.name for a in current_user.achievements]
    }
    return jsonify(user_stats)