# app/routes/achievement_routes.py
@bp.route('/achievements', methods=['GET'])
@jwt_required()
def get_achievements():
    user_id = get_jwt_identity()
    achievements = UserAchievement.query.filter_by(user_id=user_id).all()
    return jsonify([a.to_dict() for a in achievements])

@bp.route('/achievements/check', methods=['POST'])
@jwt_required()
def check_achievements():
    user_id = get_jwt_identity()
    # Check for new achievements based on user's activity
    return jsonify({'newAchievements': []})