from flask import Blueprint, jsonify, request
import requests
from app import db, socketio
from app.models.user import User
from backend.app.services.carbon_footprint import CarbonFootprintService
from app.routes.auth import token_required  # Import token_required from 

bp = Blueprint('calculator', __name__, url_prefix='/api/calculator')

@bp.route('/calculate-footprint', methods=['POST'])
@token_required
def calculate_footprint(current_user):
    data = request.get_json()
    
    # Using CarbonFootprintService for calculation
    service = CarbonFootprintService(current_user)
    result = service.calculate_footprint(data['distance'], data['vehicle'])
    
    # Update user stats
    current_user.total_distance += float(data['distance'])
    current_user.total_emissions += result.carbonFootprint
    db.session.commit()
    
    # Emit event to update leaderboard
    socketio.emit('leaderboard_update', {'user_id': current_user.id, 'total_emissions': current_user.total_emissions})
    
    return jsonify(result)