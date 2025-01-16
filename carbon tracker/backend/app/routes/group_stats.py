from flask import Blueprint, jsonify, request
from app import db
from app.models.group import Group
from app.routes.auth import token_required  # Import token_required from 
bp = Blueprint('group_stats', __name__, url_prefix='/api/group')

@bp.route('/stats', methods=['POST'])
@token_required
def get_group_stats(current_user):
    data = request.get_json()
    group = Group.query.get(data['group_id'])
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    return jsonify({
        "group_name": group.name,
        "total_distance": group.total_distance,
        "total_emissions": group.total_emissions,
        "members": len(group.members)
    })