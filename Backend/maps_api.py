from flask import request, jsonify, Blueprint
from utils.db_utils import db

map_bp = Blueprint('maps', __name__)

collection = db.maps

@map_bp.route("/trucks", methods=["GET"])
def get_trucks():
    """Return current truck states from the database."""
    trucks = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's _id field
    return jsonify(trucks)


@map_bp.route("/trucks/<int:truck_id>", methods=["PUT"])
def update_truck_state(truck_id):
    """Update the state of a specific truck."""
    data = request.json
    update_result = collection.update_one(
        {"id": truck_id},
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


@map_bp.route("/trucks/<int:truck_id>/services", methods=["POST"])
def add_service_request(truck_id):
    """Add a requested service for a specific truck."""
    data = request.json
    new_service = data.get("service")
    if not new_service:
        return jsonify({"error": "No service provided"}), 400

    update_result = collection.update_one(
        {"id": truck_id},
        {"$push": {"requested_services": new_service}}
    )
    if update_result.matched_count > 0:
        updated_truck = collection.find_one({"id": truck_id}, {"_id": 0})
        return jsonify({"message": "Service added", "truck": updated_truck})
    return jsonify({"error": "Truck not found"}), 404
