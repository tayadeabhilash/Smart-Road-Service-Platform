from flask import Flask, Blueprint, jsonify, request
from bson import ObjectId
from pymongo import MongoClient

from utils.db_utils import db

# MongoDB Collections
trucks = db.Requestservices
services = db.services

# Create Blueprint for API
api_blueprint = Blueprint('api', __name__)

# Create a New Truck
@api_blueprint.route('/trxucks', methods=['POST'])
def add_truck():
    try:
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
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get All Trucks
@api_blueprint.route('/trucks', methods=['GET'])
def get_trucks():
    try:
        all_trucks = list(trucks.find())
        for truck in all_trucks:
            truck['_id'] = str(truck['_id'])
        return jsonify(all_trucks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add a New Service Request
@api_blueprint.route('/services', methods=['POST'])
def add_service():
    try:
        data = request.json
        service = {
            "truckId": ObjectId(data['truckId']),
            "serviceCategory": data['serviceCategory'],
            "specificServices": data['specificServices'],
            "requestedBy": data['requestedBy'],
            "status": "scheduled",
            "notes": data.get('notes', ""),
            "startTime": data['startTime'],
            "endTime": data['endTime']
        }
        service_id = services.insert_one(service).inserted_id

        # Update truck status
        trucks.update_one(
            {"_id": ObjectId(data['truckId'])},
            {"$set": {"status": "on-duty", "availability": False}}
        )
        return jsonify({"message": "Service request created", "id": str(service_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get All Service Requests
@api_blueprint.route('/services', methods=['GET'])
def get_services():
    try:
        all_services = list(services.find())
        for service in all_services:
            service['_id'] = str(service['_id'])
            service['truckId'] = str(service['truckId'])
        return jsonify(all_services), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update a Service Request by ID
@api_blueprint.route('/services/<string:service_id>', methods=['PATCH'])
def update_service(service_id):
    try:
        data = request.json
        result = services.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": {
                "truckId": ObjectId(data['truckId']),
                "serviceCategory": data['serviceCategory'],
                "specificServices": data['specificServices'],
                "requestedBy": data['requestedBy'],
                "status": data.get('status', 'scheduled'),
                "notes": data.get('notes', ""),
                "startTime": data['startTime'],
                "endTime": data['endTime']
            }}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Service request not found"}), 404
        return jsonify({"message": f"Service request {service_id} updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete a Service Request by ID
@api_blueprint.route('/services/<string:service_id>', methods=['DELETE'])
def delete_service(service_id):
    try:
        result = services.find_one_and_delete({"_id": ObjectId(service_id)})
        if not result:
            return jsonify({"error": f"Service request {service_id} not found"}), 404

        # Update truck status
        trucks.update_one(
            {"_id": result["truckId"]},
            {"$set": {"status": "idle", "availability": True}}
        )
        return jsonify({"message": f"Service request {service_id} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get a Specific Service Request by ID
@api_blueprint.route('/services/<string:service_id>', methods=['GET'])
def get_service_by_id(service_id):
    try:
        service = services.find_one({"_id": ObjectId(service_id)})
        if not service:
            return jsonify({"error": "Service request not found"}), 404

        service['_id'] = str(service['_id'])
        service['truckId'] = str(service['truckId'])
        return jsonify(service), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Register Blueprint
app.register_blueprint(api_blueprint, url_prefix='/api')

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
