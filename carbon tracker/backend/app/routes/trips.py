# backend/app/routes/trips.py
from flask import Blueprint, request, jsonify
from app.services.carbon_footprint import calculate_carbon_footprint
from app.services.database import get_db_connection

bp = Blueprint('trips', __name__)

@bp.route('/track_trip', methods=['POST'])
def track_trip():
    data = request.json
    carbon_footprint = calculate_carbon_footprint(data['distance'], data['mode'])
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO trips (user_id, distance, mode, carbon_footprint) VALUES (%s, %s, %s, %s)",
        (data['user_id'], data['distance'], data['mode'], carbon_footprint)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"carbon_footprint": carbon_footprint}), 200

@bp.route('/user_stats/<int:user_id>', methods=['GET'])
def user_stats(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT SUM(carbon_footprint) as total_footprint, COUNT(*) as trip_count FROM trips WHERE user_id = %s",
        (user_id,)
    )
    stats = cursor.fetchone()
    cursor.close()
    conn.close()

    return jsonify(stats), 200