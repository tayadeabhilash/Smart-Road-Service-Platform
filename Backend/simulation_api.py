from flask import Blueprint, jsonify, request, Response
import threading
import time
import io
from bson.objectid import ObjectId
from PIL import Image
import uuid
from utils.db_utils import db
# import carla

simulation_blueprint = Blueprint('simulation_api', __name__)

# Global CARLA objects and shared state
# client = carla.Client('localhost', 2000)
# client.set_timeout(10.0)
#
# world = None
# vehicle = None
# camera = None
# latest_frame = None
# frame_lock = threading.Lock()
#
#
# def set_weather(world, weather_condition):
#     weather_presets = {
#         "clear": carla.WeatherParameters.ClearNoon,
#         "cloudy": carla.WeatherParameters.CloudyNoon,
#         "rainy": carla.WeatherParameters.WetNoon,
#         "stormy": carla.WeatherParameters.HardRainNoon
#     }
#     if weather_condition in weather_presets:
#         world.set_weather(weather_presets[weather_condition])
#     else:
#         raise ValueError("Invalid weather condition. Valid options: clear, cloudy, rainy, stormy.")
#
#
# def camera_callback(image):
#     global latest_frame, frame_lock
#     array = image.raw_data
#     img = Image.frombytes("RGBA", (image.width, image.height), bytes(array))
#     img = img.convert("RGB")
#     with frame_lock:
#         latest_frame = img
#
#
# @simulation_blueprint.route('/camera_stream', methods=['GET'])
# def camera_stream():
#     def generate():
#         global latest_frame, frame_lock
#         while True:
#             with frame_lock:
#                 if latest_frame is not None:
#                     buf = io.BytesIO()
#                     latest_frame.save(buf, format="JPEG")
#                     yield (b'--frame\r\n'
#                            b'Content-Type: image/jpeg\r\n\r\n' +
#                            buf.getvalue() + b'\r\n')
#             time.sleep(0.1)  # Stream at ~10 FPS
#     return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')
#
#
# @simulation_blueprint.route('/run_simulation', methods=['POST'])
# def run_simulation():
#     global client, world, vehicle, camera
#
#     data = request.get_json()
#     map_name = data.get("map", "Town03")
#     weather_condition = data.get("weather", "clear")
#
#     simulation_id = str(uuid.uuid4())
#
#     try:
#         # Load the specified map
#         world = client.load_world(map_name)
#
#         set_weather(world, weather_condition)
#
#         blueprint_library = world.get_blueprint_library()
#         vehicle_bp = blueprint_library.filter('vehicle.*truck*')[0]
#         spawn_point = world.get_map().get_spawn_points()[0]
#         vehicle = world.spawn_actor(vehicle_bp, spawn_point)
#
#         camera_bp = blueprint_library.find('sensor.camera.rgb')
#         camera_bp.set_attribute('image_size_x', '800')
#         camera_bp.set_attribute('image_size_y', '600')
#         camera_spawn_point = carla.Transform(
#             carla.Location(x=-6.0, y=0.0, z=3.0),
#             carla.Rotation(pitch=-15.0)
#         )
#         camera = world.spawn_actor(camera_bp, camera_spawn_point, attach_to=vehicle)
#
#         camera.listen(camera_callback)
#
#         vehicle.set_autopilot(True)
#
#         simulation_data = []
#         start_time = time.time()
#         while time.time() - start_time < 120:
#             transform = vehicle.get_transform()
#             velocity = vehicle.get_velocity()
#             data_point = {
#                 "timestamp": time.time(),
#                 "location": {
#                     "x": transform.location.x,
#                     "y": transform.location.y,
#                     "z": transform.location.z
#                 },
#                 "rotation": {
#                     "pitch": transform.rotation.pitch,
#                     "yaw": transform.rotation.yaw,
#                     "roll": transform.rotation.roll
#                 },
#                 "velocity": {
#                     "x": velocity.x,
#                     "y": velocity.y,
#                     "z": velocity.z
#                 }
#             }
#             simulation_data.append(data_point)
#             time.sleep(0.5)
#
#         # Clean up
#         camera.stop()
#         camera.destroy()
#         vehicle.destroy()
#         camera = None
#         vehicle = None
#
#         metadata = {
#             "simulation_id": simulation_id,
#             "map": map_name,
#             "weather": weather_condition,
#             "start_time": time.time(),
#             "vehicle_data": simulation_data
#         }
#         db.simulation_metadata.insert_one(metadata)
#
#         print(f"Simulation ID: {simulation_id}")
#         for entry in simulation_data:
#             print(entry)
#
#         return jsonify({
#             "status": "Simulation completed successfully!",
#             "simulation_id": simulation_id,
#             "data_count": len(simulation_data)
#         }), 200
#
#     except Exception as e:
#         return jsonify({
#             "status": "Simulation completed successfully!",
#             "simulation_id": simulation_id,
#             "data_count": len(simulation_data)
#         }), 200


@simulation_blueprint.route('/', methods=['GET'])
def list_simulations():
    try:
        simulations_cursor = db.simulation_metadata.find({})

        simulations_list = []

        for sim in simulations_cursor:
            sim['_id'] = str(sim['_id'])
            simulations_list.append(sim)

        return jsonify(simulations_list), 200

    except Exception as e:

        return jsonify({"error": str(e)}), 500


@simulation_blueprint.route('/<simulation_id>', methods=['DELETE'])
def delete_simulation(simulation_id):
    try:
        result = db.simulation_metadata.delete_one({"_id": ObjectId(simulation_id)})

        if result.deleted_count == 1:
            return jsonify({"status": "success", "message": "Simulation deleted successfully"}), 200
        else:
            return jsonify({"status": "error", "message": "Simulation not found"}), 404

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
