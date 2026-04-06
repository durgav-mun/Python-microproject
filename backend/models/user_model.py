from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db

def create_user(username, email, password):
    db = get_db()
    
    # Check if a user with the same username or email already exists
    if db.users.find_one({"$or": [{"username": username}, {"email": email}]}):
        return False, "Username or email already exists"

    password_hash = generate_password_hash(password)
    db.users.insert_one({
        "username": username,
        "email": email,
        "password_hash": password_hash
    })
    return True, "User created successfully"

def verify_user(email, password):
    db = get_db()
    user = db.users.find_one({"email": email})
    
    if user and check_password_hash(user['password_hash'], password):
        # Convert ObjectId to string to make it JSON serializable
        user['_id'] = str(user['_id'])
        # Map _id to id so it matches our previous SQLite behavior for auth_routes
        user['id'] = user.pop('_id')
        return True, user
    return False, "Invalid email or password"
