from flask import Blueprint, request, jsonify
from models.user_model import create_user, verify_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
        
    success, message = create_user(username, email, password)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 409

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
        
    success, result = verify_user(email, password)
    if success:
        user_data = {
            "id": result["id"],
            "username": result["username"],
            "email": result["email"]
        }
        return jsonify({"message": "Login successful", "user": user_data}), 200
    else:
        return jsonify({"error": result}), 401
