from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from schedule_api import api_blueprint, init_db

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://abhilashtayade:sgHtoPZSsJpPAt6p@cluster.0n3nazs.mongodb.net/smarttruck"
mongo = PyMongo(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

init_db(mongo)

# Register the API blueprint
app.register_blueprint(api_blueprint, url_prefix='/schedule')

if __name__ == '__main__':
    app.run(debug=True)
