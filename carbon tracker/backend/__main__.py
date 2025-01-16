# main.py
from flask import Flask, request, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
import jwt
import os
from dotenv import load_dotenv
import requests
from functools import wraps
import mysql.connector
import json
import http.client
import random
from sqlalchemy import func


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database Configuration using mysql-connector-python
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(255))
    travel_mode = db.Column(db.String(50))
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    invited_emails = db.Column(db.JSON)  # Use JSON for storing lists

class Commute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    mode = db.Column(db.String(50))
    distance = db.Column(db.Float)
    duration = db.Column(db.Integer)
    carbon_footprint = db.Column(db.Float)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    is_auto_detected = db.Column(db.Boolean, default=False)

class Community(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    invite_code = db.Column(db.String(10), unique=True)

class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    type = db.Column(db.String(50))
    description = db.Column(db.Text)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

class Challenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    points = db.Column(db.Integer)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)

# Quiz Question Model
class QuizQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500))
    options = db.Column(db.JSON)
    correct_answer = db.Column(db.String(1))
    points = db.Column(db.Integer)

# Quiz Result Model
class QuizResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    score = db.Column(db.Integer)
    completed_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
class Reward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id= db.Column(db.Integer)
    score= db.Column(db.Integer)
    cost = db.Column(db.Float)
    is_claimed = db.Column(db.Boolean, default=False)

@app.route('/user/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email_exists = User.query.filter_by(email=data['email']).first() is not None
    return jsonify({'exists': email_exists})

# Authentication Routes
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if 'invitedEmails' not in data or not data['invitedEmails']:
        return jsonify({'error': 'invitedEmails is required'}), 400
    
    user = User(
        email=data['email'],
        username=data['username'],
        password_hash=generate_password_hash(data['password']),
        invitedEmails=data['invitedEmails']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registration successful'})

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        local_time = datetime.now()  # Local time (naïve)
        utc_time = local_time.astimezone(timezone.utc)
        token = jwt.encode({
            'user_id': user.id,
            'exp': utc_time + timedelta(days=1)
        }, app.config['SECRET_KEY'], )
        
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/auth/social-login', methods=['POST'])
def social_login():
    data = request.get_json()
    # Implement social login logic
    pass

@app.route('/auth/onboarding', methods=['POST'])
def onboarding():
    data = request.get_json()
    
    # Validate incoming data
    if not all(key in data for key in ['email', 'username', 'password', 'travelMode', 'invitedEmails']):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        user = User(
            email=data['email'],
            username=data['username'],
            password_hash=generate_password_hash(data['password']),
            travel_mode=data.get('travelMode'),
            invited_emails=data.get('invitedEmails', [])
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Onboarding complete'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Dashboard Routes
@app.route('/dashboard/carbon-score', methods=['GET'])
def get_carbon_score():
    # Extract token and validate
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'error': 'Authorization token is required'}), 400

    token = auth_header.split(" ")[1]
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
    user_id = decoded_data.get('user_id')

    # Query commutes, excluding those with None start_time values
    commutes = Commute.query.filter_by(user_id=user_id).all()


    now = datetime.now(timezone.utc)

    # Calculate totals with null checks
    daily_total = sum(c.carbon_footprint for c in commutes if c.start_time.date() == now.date())
    monthly_total = sum(c.carbon_footprint for c in commutes if c.start_time.month == now.month and c.start_time.year == now.year)
    total_carbon = sum(c.carbon_footprint for c in commutes)

    return jsonify({'daily': daily_total, 'monthly': monthly_total, 'total': total_carbon}), 200
    

@app.route('/community/rankings', methods=['GET'])
def get_community_rankings():
    try:
        # Extract user_id from query parameters or token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({'error': 'Authorization token is required'}), 400
        
        token = auth_header.split(" ")[1]
        decoded_data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        
        user_id = decoded_data.get('user_id')

        # Fetch all users and their points
        users = User.query.order_by(User.points.desc()).all()
        
 

        # Prepare rankings data
        rankings = []
        user_rank = None
        for index, user in enumerate(users):
            # Calculate total carbon saved for each user
            total_carbon_saved = db.session.query(func.sum(Commute.carbon_footprint)).filter_by(user_id=user.id).scalar() or 0

            rank_data = {
                'position': index + 1,
                'username': user.username,
                'points': user.points,
                'change': random.randint(-5, 5),  # Example rank change (replace with real logic)
                'carbonsaved': total_carbon_saved
            }
    
            rankings.append(rank_data)

            # Identify the current user's rank
            if user.id == user_id:
                user_rank = rank_data

        return jsonify({'rankings': rankings, 'userRank': user_rank}), 200

    except jwt.exceptions.DecodeError:
        return jsonify({'error': 'Invalid or malformed token'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dashboard/eco-tips', methods=['GET'])
def get_eco_tips():
    try:
        # Load eco tips from external JSON file
        with open('eco-tips.json', 'r') as file:
            tips = json.load(file)
        
        # Select a random tip
        random_tip = random.choice(tips)
        
        return jsonify(random_tip), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Commute Tracking Routes
@app.route('/commute/auto-detect', methods=['POST'])
def auto_detect_commute():
    data = request.get_json()
    # Implement auto-detection logic using activity data
    pass

@app.route('/commute/calculate', methods=['POST'])
def calculate_commute():
    try:
        # Extract token and validate
        data = request.get_json()
        token = data.get('token')
        if not token:
            return jsonify({'error': 'Token is required'}), 400

        # Decode JWT
        decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded_data.get('user_id')
        current_user = User.query.filter_by(id=user_id).first()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404

        # Validate input data
        mode = data.get('mode')
        distance = data.get('distance')
        if not mode or not distance:
            return jsonify({'error': 'Mode and distance are required'}), 400

        # Create commute record
        start_time=datetime.now(timezone.utc)
        commute = Commute(user_id=user_id, mode=mode, distance=distance, start_time=start_time)
        db.session.add(commute)

        # Call external API for carbon footprint calculation
        conn = http.client.HTTPSConnection("carbonfootprint1.p.rapidapi.com")
        headers = {
            'x-rapidapi-key': os.getenv('RAPIDAPI_KEY'),
            'x-rapidapi-host': "carbonfootprint1.p.rapidapi.com"
        }
        
        conn.request(
            "GET",
            f"/CarbonFootprintFromCarTravel?distance={distance}&vehicle={mode}",
            headers=headers
        )
        
        res = conn.getresponse()
        
        # Check if the response status is 200
        if res.status != 200:
            raise Exception(f"API call failed with status {res.status}: {res.reason}")

        # Read and decode response data
        response_data = res.read().decode("utf-8")
        print(response_data)
        
        # Ensure that response data is not empty
        if not response_data:
            raise Exception("API returned an empty response")

        # Parse JSON safely
        try:
            response_json = json.loads(response_data)
            carbon_equivalent = response_json.get('carbonEquivalent')
            
            if carbon_equivalent is None:
                raise Exception("API response does not contain 'carbonEquivalent'")
            
            # Save carbon equivalent to commute record
            commute.carbon_footprint = carbon_equivalent
            db.session.commit()
            
            return jsonify({'carbon_footprint': commute.carbon_footprint}), 201
        
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to decode JSON: {str(e)}")

    except jwt.exceptions.DecodeError:
        return jsonify({'error': 'Invalid or malformed token'}), 400

    except Exception as e:
        current_app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/commute/start', methods=['POST'])
def start_commute():
    try:
        data = request.get_json()
        token = data.get('token')
        
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        
        decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        
        user_id = decoded_data.get('user_id')
        current_user = User.query.filter_by(id=user_id).first()
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        commute_mode_data=data.get('mode')
        
        commute_start_time=datetime.now(timezone.utc)
        
       # Create and save commute record
        
        commute= Commute(
           user_id=current_user.id,
           mode=commute_mode_data,
           start_time=commute_start_time 
       )
        
        db.session.add(commute)
        db.session.commit()
        
        return jsonify({'commute_id': commute.id}),201
        
    except jwt.exceptions.DecodeError:
       return jsonify({'error':'Invalid or malformed token'}),400
   
    except Exception as e:
       return jsonify({'error':str(e)}),500

@app.route('/commute/stop', methods=['POST'])
def stop_commute():
    try:
        data = request.get_json()

        # Retrieve commute record by ID
        commute_id = data.get('commuteId')
        commute_mode = data.get('carType')
        
        commute = db.session.get(Commute, commute_id)
        
        if not commute:
            return jsonify({'error': 'Commute not found'}), 404

        # Update end time
        commute.end_time = datetime.now(timezone.utc)
        
        user_data = data.get('user')
        print(user_data)
        passengers_data = data.get('passengers', [])

        # Set up headers for API request
        headers = {
            "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
            "X-RapidAPI-Host": "carbonfootprint1.p.rapidapi.com"
        }
        
        # Helper function to calculate carbon footprint
        def get_carbon_footprint(distance, vehicle):
            response = requests.get(
                "https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel",
                headers=headers,
                params={"distance": distance, "vehicle": vehicle}
            )
            if response.status_code == 200:
                return response.json().get("carbonEquivalent")
            else:
                # Log the error message for debugging
                print(f"Error fetching carbon footprint: {response.status_code} - {response.text}")
                return None

        # Calculate carbon footprint for the user
        user_carbon_footprint = get_carbon_footprint(user_data['distance'], commute_mode)
        if user_carbon_footprint is not None:
            commute.carbon_footprint = user_carbon_footprint
        
        # Process passengers' carbon footprints
        passenger_footprints = []
        
        for passenger in passengers_data:
            passenger_footprint = get_carbon_footprint(passenger['distance'], commute_mode)
            
            # Fetch user ID from User table using email
            passenger_user = User.query.filter_by(email=passenger['email']).first()
            passenger_user_id = passenger_user.id if passenger_user else None
            
            passenger_footprints.append({
                "email": passenger['email'],
                "carbonFootprint": passenger_footprint,
                "userId": passenger_user_id
            })
            
            # Save passenger's carbon footprint in the database
            if passenger_user_id is not None:
                passenger_commute_entry = Commute(
                    user_id=passenger_user_id,
                    mode=commute_mode,
                    distance=passenger['distance'],
                    carbon_footprint=passenger_footprint,
                    start_time=commute.start_time,
                    end_time=commute.end_time,
                    is_auto_detected=False
                )
                db.session.add(passenger_commute_entry)

        db.session.commit()

        return jsonify({
            "userCarbonFootprint": user_carbon_footprint,
            "passengerCarbonFootprints": passenger_footprints
        })
    
    except Exception as e:
        print(f"Exception occurred: {str(e)}")  # Log the exception for debugging
        return jsonify({"error": str(e)}), 500


# Gamification Routes
@app.route('/gamification/badges', methods=['GET'])
def get_badges():
    user_id = request.args.get('user_id')
    badges = Badge.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'type': b.type,
        'description': b.description,
        'earned_at': b.earned_at.strftime('%Y-%m-%d')
    } for b in badges])

@app.route('/gamification/challenges', methods=['GET'])
def get_challenges():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({'error': 'Authorization token is required'}), 400

        token = auth_header.split(" ")[1]
        if not token:
            return jsonify({'error': 'Token is required'}), 400

        decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded_data.get('user_id')
        
        quizresult = QuizResult.query.filter_by(user_id=user_id).all()
        return jsonify([{
        'id': q.id,
        'user_id': q.user_id,
        'score': q.score,
        'completed_at': q.completed_at
        } for q in quizresult]), 200

        

    except Exception as e:
        # Log the error and return a JSON error response
        print(f"Error fetching challenges: {e}")
        return make_response(jsonify({'error': 'Internal Server Error'}), 500)

# Load quiz data from JSON file
def load_quiz_data():
    with open('quiz.json', 'r') as file:
        return json.load(file)

quiz_data = load_quiz_data()

@app.route('/api/quiz/questions', methods=['GET'])
def get_questions():
    try:
        # Access the questions directly from the loaded quiz data
        questions = quiz_data['ecodriving_quiz']['questions']
        questions_list = []

        for q in questions:
            questions_list.append({
                'id': q['id'],
                'question': q['question'],
                'options': q['options'],
                'points': q['points'],
                'correct_answer': q['correct_answer']  # Include correct answer
            })

        return jsonify({'questions': questions_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    try:
        # Parse JSON data from request
        data = request.get_json()
        score = data.get('score')
        token = data.get('token')
        
        # Decode JWT token to get user_id
        decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded_data.get('user_id')
        
        # Add quiz result to QuizResult table
        quiz_result = QuizResult(user_id=user_id, score=score)
        db.session.add(quiz_result)
        
        points = score
        costPerPoint = 0.01
        totalCost = points * costPerPoint
            
        reward= Reward(user_id=user_id, score=score, cost=totalCost)
        db.session.add(reward)
        
        # Retrieve user and update points
        user = User.query.filter_by(id=user_id).first()
        
        
        if user:
            user.points += score  # Assuming 'points' is the column name for user's total points

            
            db.session.commit()
            return jsonify({'message': 'Quiz submitted successfully', 'score': score})

        else:
            return jsonify({'error': 'User not found'}), 404
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Rewards Routes
@app.route('/rewards/available', methods=['GET'])
def get_rewards():
    rewards = Reward.query.filter_by(is_claimed=False).all()
    return jsonify([{
        'id': r.id,
        'user_id': r.user_id,
        'score': r.score,
        'cost': r.cost
    } for r in rewards])

@app.route('/user/points', methods=['GET'])
def get_user_points():
    # Extract token and validate
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'error': 'Authorization token is required'}), 400

    token = auth_header.split(" ")[1]
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
    user_id = decoded_data.get('user_id')
    

    user = db.session.get(User, user_id)
    return jsonify({'points': user.points})

@app.route('/rewards/claim', methods=['POST'])
def claim_reward():
    # Extract token and validate
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({'error': 'Authorization token is required'}), 400

    token = auth_header.split(" ")[1]
    decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
    user_id = decoded_data.get('user_id')

    # Get total cost from request
    data = request.get_json()
    total_cost = data.get('total_cost')

    if total_cost is None:
        return jsonify({'error': 'Total cost is required'}), 400

    user = User.query.get(user_id)

    if user.points < total_cost:
        return jsonify({'error': 'Insufficient points'}), 400

    # Deduct points from user
    user.points -= total_cost
    db.session.commit()

    return jsonify({'message': 'Rewards claimed successfully'})

# Community Routes
@app.route('/community/create', methods=['POST'])
def create_community():
    data = request.get_json()
    community = Community(
        name=data['name'],
        description=data['description'],
        created_by=data['user_id'],
        invite_code=generate_invite_code()
    )
    db.session.add(community)
    db.session.commit()
    return jsonify({'community_id': community.id})

@app.route('/community/join', methods=['POST'])
def join_community():
    data = request.get_json()
    community = Community.query.filter_by(invite_code=data['invite_code']).first()
    if not community:
        return jsonify({'message': 'Invalid invite code'}), 404
    # Add user to community
    return jsonify({'message': 'Joined community successfully'})

# Analytics Routes
@app.route('/analytics/commute-history', methods=['GET'])
def get_commute_history():
    user_id = request.args.get('user_id')
    timeframe = request.args.get('timeframe', 'week')
    
    if timeframe == 'week':
        start_date = datetime.utcnow() - timedelta(days=7)
    elif timeframe == 'month':
        start_date = datetime.utcnow() - timedelta(days=30)
    else:
        start_date = datetime.utcnow() - timedelta(days=365)
    
    commutes = Commute.query.filter(
        Commute.user_id == user_id,
        Commute.start_time >= start_date
    ).all()
    
    return jsonify([{
        'mode': c.mode,
        'distance': c.distance,
        'carbon_footprint': c.carbon_footprint,
        'date': c.start_time
    } for c in commutes])

@app.route('/analytics/carbon-trends', methods=['GET'])
def get_carbon_trends():
    user_id = request.args.get('user_id')
    timeframe = request.args.get('timeframe', 'week')
    # Implement carbon trends analysis
    pass

# Settings Routes
@app.route('/settings/profile', methods=['GET', 'PUT'])
def handle_profile():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        user = User.query.get(user_id)
        return jsonify({
            'email': user.email,
            'username': user.username,
            'travel_mode': user.travel_mode
        })
    else:
        data = request.get_json()
        user = User.query.get(data['user_id'])
        user.username = data.get('username', user.username)
        user.travel_mode = data.get('travel_mode', user.travel_mode)
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})

@app.route('/settings/privacy', methods=['GET', 'PUT'])
def handle_privacy():
    # Implement privacy settings logic
    pass

def generate_invite_code():
    # Implement invite code generation logic
    pass

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)