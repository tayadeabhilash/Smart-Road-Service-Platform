from flask import Flask
from flask_cors import CORS

from maps_api import map_bp
from schedule_api import api_blueprint
from simulation_api import simulation_blueprint
from users_api import profile_bp
from requestservice_api import rs_blueprint
def create_app():
    app = Flask(__name__)

    CORS(app, support_credentials=True)

    # Register the API blueprint
    app.register_blueprint(api_blueprint, url_prefix='/schedule')
    app.register_blueprint(map_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(simulation_blueprint, url_prefix='/simulation')
    app.register_blueprint(rs_blueprint)
    app.run(debug=True)

if __name__ == '__main__':
    create_app()
