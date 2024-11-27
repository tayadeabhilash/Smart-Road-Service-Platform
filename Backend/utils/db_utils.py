from pymongo import MongoClient

MONGO_URI = "mongodb+srv://abhilashtayade:sgHtoPZSsJpPAt6p@cluster.0n3nazs.mongodb.net"

client = MongoClient(
    MONGO_URI,
    ssl=True,
    tlsAllowInvalidCertificates=True
)

db = client['smarttruck']
