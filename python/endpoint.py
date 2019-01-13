from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request
from pymongo import MongoClient
app = Flask(__name__)
CORS(app)

client = MongoClient('localhost', 27017)
db = client.MyNote
collection = db.allUsers

@app.route('/')
def hello_world():
   return "Hello World"

@app.route('/authlogin',methods = ['POST'])
def auth_login():
	content = request.json
	username = content["username"]
	password = content["password"]
	return jsonify(auth_login_da(username, password))

def auth_login_da(un,pw):
	doc = collection.find_one({"username": un})
	if(doc == None):
		return {"code": -1, "message": "username does not exist" }
	if(doc["password"] != pw):
		return {"code": 0, "message": "password does not match" }
	return {"code": 1, "message": un }

@app.route('/saveNote',methods = ['POST'])
def saveNote():
	content = request.json
	username = content["username"]
	text = content["text"]
	title = content["title"]
	return jsonify(saveNote_da(username, title, text))

def saveNote_da(un,title,text):
	doc = collection.find_one({"username": un})
	notes = doc['notes']
	note = {}
	note["title"] = title
	note["content"] = text
	notes.append(note)
	updated = collection.update_one({"username": un}, {"$set":{"notes":notes}})
	if updated.acknowledged:
		return {"code": 0, "message": "Note added successfully"}
	else:
		return {"code": -1, "message": "Problem while adding note"}

@app.route('/updateNote',methods = ['POST'])
def updateNote():
	content = request.json
	username = content["username"]
	text = content["text"]
	title = content["title"]
	old = content["oldNote"]
	return jsonify(updateNote_da(username, old, title, text))

def updateNote_da(un,old,title,text):
	doc = collection.find_one({"username": un})
	notes = doc['notes']
	i = notes.index(old)
	note = {}
	note["title"] = title
	note["content"] = text
	notes[i] = note
	updated = collection.update_one({"username": un}, {"$set":{"notes":notes}})
	if updated.acknowledged:
		return {"code": 0, "message": "Note updated successfully"}
	else:
		return {"code": -1, "message": "Problem while updating note"}

@app.route('/removeNote',methods = ['POST'])
def removeNote():
	content = request.json
	username = content["username"]
	note = content["note"]
	return jsonify(removeNote_da(username, note))

def removeNote_da(un,note):
	doc = collection.find_one({"username": un})
	notes = doc['notes']
	notes.remove(note)
	updated = collection.update_one({"username": un}, {"$set":{"notes":notes}})
	if updated.acknowledged:
		return {"code": 0, "message": "Note removed successfully"}
	else:
		return {"code": -1, "message": "Problem while removing note"}

@app.route('/signup',methods = ['POST'])
def signup():
	content = request.json
	username = content["username"]
	password = content["password"]
	return jsonify(signup_da(username, password))
	
def signup_da(un,pw):
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
	return jsonify(getNotes_da(username))

def getNotes_da(un):
	doc = collection.find_one({"username": un})
	if(doc == None or doc['notes'] == None):
		return []
	return doc['notes']



if __name__ == '__main__':
   app.run()