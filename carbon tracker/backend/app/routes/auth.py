# backend/app/routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from app.models.user import User
from functools import wraps
import jwt
import datetime


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check if token is in headers
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Decode token to get user information
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

bp = Blueprint('auth', __name__)

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user = User(username=data['username'], email=data['email'])
    
    # Ensure password is hashed before saving
    user.set_password(data['password'])
    
    user.save()
    
    return jsonify({"message": "User created successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.get_by_username(data['username'])

    if user and user.check_password(data['password']):
        # Create JWT payload with user information and expiration time
        token_payload = {
            'public_id': user.public_id,  # Assuming each user has a unique public_id
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
        }

        # Generate the token using the secret key
        token = jwt.encode(token_payload, current_app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({
            'message': 'Login successful',
            'token': token  # Return the generated token
        }), 200

    else:
        return jsonify({'message': 'Invalid credentials'}), 401