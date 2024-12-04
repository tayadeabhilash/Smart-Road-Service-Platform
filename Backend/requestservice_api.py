from flask import Flask, Blueprint, jsonify, request
from bson import ObjectId

from utils.db_utils import db

# MongoDB Collections
trucks = db.maps
servicerequests = db.servicerequests

rs_blueprint = Blueprint('rs', __name__)


# Add a New Service Request
@rs_blueprint.route('/services', methods=['POST'])
def add_service():
    try:
        data = request.json
        service = {
            "truckId": ObjectId(data['truckId']),
            "serviceCategory": data['serviceCategory'],
            "specificServices": data['specificServices'],
            "requestedBy": data['requestedBy'],
            "status": "in_process",
            "notes": data.get('notes', ""),
        }
        service_id = servicerequests.insert_one(service).inserted_id

        return jsonify({"message": "Service request created", "id": str(service_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Get All Service Requests
@rs_blueprint.route('/services', methods=['GET'])
def get_services():
    try:
        all_services = list(servicerequests.find())
        for service in all_services:
            service['_id'] = str(service['_id'])
            service['truckId'] = str(service['truckId'])
        return jsonify(all_services), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update a Service Request by ID
@rs_blueprint.route('/services/<string:service_id>', methods=['PATCH'])
def update_service(service_id):
    try:
        data = request.json
        result = servicerequests.update_one(
            {"_id": ObjectId(service_id)},
            {"$set": {
                "truckId": ObjectId(data['truckId']),
                "serviceCategory": data['serviceCategory'],
                "specificServices": data['specificServices'],
                "requestedBy": data['requestedBy'],
                "status": data.get('status', 'scheduled'),
                "notes": data.get('notes', "")
            }}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Service request not found"}), 404
        return jsonify({"message": f"Service request {service_id} updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Delete a Service Request by ID
@rs_blueprint.route('/services/<string:service_id>', methods=['DELETE'])
def delete_service(service_id):
    try:
        result = servicerequests.find_one_and_delete({"_id": ObjectId(service_id)})
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
@rs_blueprint.route('/services/<string:service_id>', methods=['GET'])
def get_service_by_id(service_id):
    try:
        service = servicerequests.find_one({"_id": ObjectId(service_id)})
        if not service:
            return jsonify({"error": "Service request not found"}), 404

        service['_id'] = str(service['_id'])
        service['truckId'] = str(service['truckId'])
        return jsonify(service), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
