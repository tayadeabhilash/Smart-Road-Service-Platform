from flask import request, jsonify, Blueprint
from bson.objectid import ObjectId
from utils.db_utils import db

map_bp = Blueprint('maps', __name__)

collection = db.maps

users_collection = db.users


@map_bp.route("/trucks", methods=["GET"])
def get_trucks():
    trucks = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's _id field
    return jsonify(trucks)


@map_bp.route("/trucks", methods=["POST"])
def add_truck():
    data = request.json
    print(data)
    user = users_collection.find_one({"username": data['username']}, {"_id": 1})
    print(user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = str(user["_id"])

    truck = {
        "name": data.get("name"),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "speed": data.get("speed", "0"),
        "status": data.get("status", "Idle"),
        "requested_services": data.get("requested_services", []),
        "user_id": user_id,
    }
    collection.insert_one(truck)
    return jsonify({"message": "Truck added successfully"})


@map_bp.route("/trucks/<string:username>", methods=["GET"])
def get_trucks_for_user(username):
    user = users_collection.find_one({"username": username}, {"_id": 1})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = str(user["_id"])
    trucks = list(collection.find({"user_id": user_id}))
    if not trucks:
        return jsonify({"error": "No trucks found for this user"}), 404
    for truck in trucks:
        truck['_id'] = str(truck['_id'])
    return jsonify({"trucks": trucks})


@map_bp.route("/users/<string:user_id>/link-truck", methods=["POST"])
def link_truck_to_user(user_id):
    data = request.json
    truck_id = data.get("truck_id")

    if not truck_id:
        return jsonify({"error": "Truck ID is required"}), 400

    truck = collection.find_one({"id": truck_id})
    if not truck:
        return jsonify({"error": "Truck not found"}), 404

    collection.update_one({"id": truck_id}, {"$set": {"user_id": user_id}})
    return jsonify({"message": f"Truck {truck_id} linked to user {user_id}."})


@map_bp.route("/trucks/<truck_id>", methods=["PUT"])
def update_truck_state(truck_id):
    data = request.json
    update_result = collection.update_one(
        {"_id": ObjectId(truck_id)},
        {
            "$set": {
                "latitude": data.get("latitude"),
                "longitude": data.get("longitude"),
                "speed": data.get("speed"),
                "status": data.get("status"),
                "requested_services": data.get("requested_services"),
            }
        }
    )
    if update_result.matched_count > 0:
        updated_truck = collection.find_one({"id": truck_id}, {"_id": 0})
        return jsonify({"message": "Truck state updated", "truck": updated_truck})
    return jsonify({"error": "Truck not found"}), 404
