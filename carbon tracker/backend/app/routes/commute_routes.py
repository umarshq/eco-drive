# app/routes/commute_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Commute
from app import db

bp = Blueprint('commute', __name__)

@bp.route('/commute/start', methods=['POST'])
@jwt_required()
def start_commute():
    data = request.get_json()
    user_id = get_jwt_identity()
    commute = Commute(
        user_id=user_id,
        travel_mode=data['mode'],
        start_time=datetime.now()
    )
    db.session.add(commute)
    db.session.commit()
    return jsonify(commute.to_dict())

@bp.route('/commute/stop', methods=['POST'])
@jwt_required()
def stop_commute():
    data = request.get_json()
    commute = Commute.query.get(data['commuteId'])
    commute.end_time = datetime.now()
    commute.calculate_carbon_footprint()
    db.session.commit()
    return jsonify(commute.to_dict())

@bp.route('/commute/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    commutes = Commute.query.filter_by(user_id=user_id).order_by(Commute.start_time.desc()).all()
    return jsonify([c.to_dict() for c in commutes])

@bp.route('/commute/manual', methods=['POST'])
@jwt_required()
def manual_entry():
    data = request.get_json()
    user_id = get_jwt_identity()
    commute = Commute(
        user_id=user_id,
        travel_mode=data['mode'],
        distance=data['distance'],
        start_time=data['startTime'],
        end_time=data['endTime'],
        is_manual_entry=True
    )
    commute.calculate_carbon_footprint()
    db.session.add(commute)
    db.session.commit()
    return jsonify(commute.to_dict())