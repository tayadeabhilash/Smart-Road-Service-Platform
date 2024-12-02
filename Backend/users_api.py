from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db_utils import db
import base64
import jwt
import datetime

profile_bp = Blueprint('profile', __name__)

users_collection = db.users  # MongoDB collection for user profiles

SECRET_KEY = 'smartfarmplatform'


@profile_bp.route("/profile", methods=["POST"])
def create_profile():
    """Create a new user profile."""
    data = request.json
    if not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    # Check if username already exists
    if users_collection.find_one({"username": data["username"]}):
        return jsonify({"error": "Username already exists"}), 400

    # Hash the password before saving
    hashed_password = generate_password_hash(data["password"], method='pbkdf2:sha256')

    # Validate Base64 image string if provided
    profile_photo = data.get("profile_photo", "")
    if profile_photo:
        try:
            base64.b64decode(profile_photo)
        except Exception:
            return jsonify({"error": "Invalid profile photo encoding"}), 400

    profile = {
        "username": data["username"],
        "password": hashed_password,
        "email": data.get("email", ""),
        "role": data.get("role", "truck_owner"),  # Default role is truck_owner
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "address": data.get("address", ""),
        "profile_photo": profile_photo
    }
    users_collection.insert_one(profile)
    return jsonify({"message": "Profile created successfully"}), 201


@profile_bp.route("/profile/<string:username>", methods=["PUT"])
def edit_profile(username):
    """Edit an existing user profile."""
    data = request.json
    update_data = {}
    print(data)
    if "email" in data:
        update_data["email"] = data["email"]
    if "fullName" in data:
        update_data["name"] = data["fullName"]
    if "mobile" in data:
        update_data["phone"] = data["mobile"]
    if "location" in data:
        update_data["address"] = data["location"]
    if "profile_photo" in data:
        try:
            base64.b64decode(data["profile_photo"])
            update_data["profile_photo"] = data["profile_photo"]
        except Exception:
            return jsonify({"error": "Invalid profile photo encoding"}), 400
    print(update_data)
    update_result = users_collection.update_one(
        {"username": username},
        {"$set": update_data}
    )
    print(update_result)
    if update_result.matched_count > 0:
        updated_profile = users_collection.find_one({"username": username}, {"_id": 0, "password": 0})
        return jsonify({"message": "Profile updated successfully", "profile": updated_profile})
    return jsonify({"error": "Profile not found"}), 404


@profile_bp.route("/profile/<string:username>", methods=["GET"])
def get_profile(username):
    """Retrieve a user's profile."""
    profile = users_collection.find_one({"username": username}, {"_id": 0, "password": 0})
    if profile:
        return jsonify(profile)
    return jsonify({"error": "Profile not found"}), 404


@profile_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and log in."""
    data = request.json
    if not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    user = users_collection.find_one({"username": data["username"]})
    if user and check_password_hash(user["password"], data["password"]):
        return jsonify({"message": "Login successful", "token": create_token(user["username"], user["role"])})
    return jsonify({"error": "Invalid username or password"}), 401


def create_token(username, role):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({'username': username, 'role': role, 'exp': expiration_time}, SECRET_KEY, algorithm='HS256')
    return token
