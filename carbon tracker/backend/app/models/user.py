# backend/app/models/user.py
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.database import get_db_connection
import uuid  # Import UUID module

class User:
    def __init__(self, username, email, password_hash=None,public_id=None):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.public_id = public_id or str(uuid.uuid4())  # Generate UUID if not provided

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        print(f"Password hash generated: {self.password_hash}")

    def check_password(self, password):
        result = check_password_hash(self.password_hash, password)
        print(f"Password check: {result}")
        return result
    
    @staticmethod
    def get_by_username(username):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_data = cursor.fetchone()
        
        # Log fetched user data for debugging
        print(f"Fetched user data: {user_data}")
        
        cursor.close()
        conn.close()

        if user_data:
            return User(user_data['username'], user_data['email'], user_data['password_hash'],user_data['public_id'])
        
        return None
    
    def save(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, public_id) VALUES (%s, %s, %s, %s)",
            (self.username, self.email, self.password_hash,self.public_id)
        )
        conn.commit()
        cursor.close()
        conn.close()