from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request
from pymongo import MongoClient
app = Flask(__name__)
CORS(app)

client = MongoClient('localhost', 27017)
db = client.test
collection = db.test

@app.route('/')
def hello_world():
   return "Hello World"

@app.route('/authlogin',methods = ['POST'])
def auth_login():
	content = request.json
	username = content["username"]
	password = content["password"]
	return jsonify(auth_login(username, password))

def auth_login(un,pw):
	doc = collection.find_one({"username": un})
	if(doc == None):
		return {"code": -1, "message": "username does not exist" }
	if(doc["password"] != pw):
		return {"code": 0, "message": "password does not match" }
	return {"code": 1, "message": un }

@app.route('/signup',methods = ['POST'])
def signup():
	content = request.json
	username = content["username"]
	password = content["password"]
	return jsonify(signup(username, password))
	
def signup(un,pw):
	doc = collection.find_one({"username": un})
	if(doc == None):
		inserted = collection.insert_one({"username": un, "password": pw, "notes": []})
		if(inserted.acknowledged):
			return {"code": 1, "message":un + " has registered successfully, you can log in now."}
		else:
			return {"code": -1, "message":"problem occoured while signing up, try again later"}
	else:
		return {"code": 0, "message": "username already exists" }

@app.route('/getNotes',methods = ['POST'])
def getNotes():
	content = request.json
	username = content["username"]
	password = content["password"]
	return jsonify(getNotes(username, password))

def getNotes(un,pw):
	doc = collection.find_one({"username": un})
	if(doc == None or doc['notes'] == None):
		return []
	return doc['notes']



if __name__ == '__main__':
   app.run()