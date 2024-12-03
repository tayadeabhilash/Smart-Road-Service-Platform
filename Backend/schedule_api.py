from flask import Blueprint, jsonify, request
from bson import ObjectId

from utils.db_utils import db

api_blueprint = Blueprint('api', __name__)

# MongoDB collections
trucks = db.servicetrucks
schedules = db.schedules

# Create a new truck
@api_blueprint.route('/trucks', methods=['POST'])
def add_truck():
    data = request.json
    truck = {
        "truckId": data['truckId'],
        "currentLocation": data['currentLocation'],
        "availability": data.get('availability', True),
        "status": "idle",
        "lastServiceDate": None
    }
    truck_id = trucks.insert_one(truck).inserted_id
    return jsonify({"message": "Truck added", "id": str(truck_id)}), 201


# Get all trucks
@api_blueprint.route('/trucks', methods=['GET'])
def get_trucks():
    all_trucks = list(trucks.find())
    for truck in all_trucks:
        truck['_id'] = str(truck['_id'])
    return jsonify(all_trucks), 200


# Schedule a service
@api_blueprint.route('', methods=['POST'])
def add_schedule():
    data = request.json
    schedule = {
        "truckId": ObjectId(data['truckId']),
        "serviceType": data['serviceType'],
        "route": data['route'],
        "startTime": data['startTime'],
        "endTime": data['endTime'],
        "status": "scheduled",
        "requestedBy": data['requestedBy'],
        "username": data['username']
    }
    schedule_id = schedules.insert_one(schedule).inserted_id
    trucks.update_one({"_id": ObjectId(data['truckId'])}, {"$set": {"status": "on-duty", "availability": False}})
    return jsonify({"message": "Schedule created", "id": str(schedule_id)}), 201


# Update schedule status
@api_blueprint.route('/<schedule_id>', methods=['PATCH'])
def update_schedule(schedule_id):
    try:
        data = request.json

        result = schedules.update_one(
            {"_id": ObjectId(schedule_id)},
            {"$set": {
                "truckId": ObjectId(data['truckId']),
                "serviceType": data['serviceType'],
                "route": data['route'],
                "startTime": data['startTime'],
                "endTime": data['endTime'],
                "status": data.get('status', 'scheduled'),
                "requestedBy": data['requestedBy']
            }}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Schedule not found"}), 404

        return jsonify({"message": f"Schedule with ID {schedule_id} updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get schedules
@api_blueprint.route('', methods=['GET'])
def get_schedules():
    all_schedules = list(schedules.find())
    for schedule in all_schedules:
        schedule['_id'] = str(schedule['_id'])
        schedule['truckId'] = str(schedule['truckId'])
    return jsonify(all_schedules), 200


@api_blueprint.route('/<username>', methods=['GET'])
def get_schedules_by_username(username):
    all_schedules = list(schedules.find({"username": username}))
    for schedule in all_schedules:
        schedule['_id'] = str(schedule['_id'])
        schedule['truckId'] = str(schedule['truckId'])
    return jsonify(all_schedules), 200


@api_blueprint.route('/<schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    try:
        # Find the schedule by ID and delete it
        result = schedules.delete_one({"_id": ObjectId(schedule_id)})

        # If no document was deleted, return an error message
        if result.deleted_count == 0:
            return jsonify({"error": f"Schedule with ID {schedule_id} not found"}), 404

        # Update the truck's status to idle and availability to True if it was on-duty because of this schedule.
        schedule_info = schedules.find_one({"_id": ObjectId(schedule_id)})

        if schedule_info:
            truck_id = schedule_info.get("truckId")
            trucks.update_one(
                {"_id": ObjectId(truck_id)},
                {"$set": {"status": "idle", "availability": True}}
            )

        return jsonify({"message": f"Schedule with ID {schedule_id} deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/<schedule_id>', methods=['GET'])
def get_schedule_by_id(schedule_id):
    try:
        # Find the schedule by its ID
        schedule = schedules.find_one({"_id": ObjectId(schedule_id)})

        if schedule:
            # Convert ObjectId to string for JSON serialization
            schedule['_id'] = str(schedule['_id'])
            schedule['truckId'] = str(schedule['truckId'])
            return jsonify(schedule), 200
        else:
            return jsonify({"error": "Schedule not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500