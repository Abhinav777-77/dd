from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import requests
import base64
from io import BytesIO
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["contentDB"]
user_collection = db["users"]
history_collection = db["history"]
contact_collection=db["contact us"]

# API details for text and image models
TEXT_API_URL = os.getenv("TEXT_API_URL")
IMAGE_API_URL = os.getenv("IMAGE_API_URL")
TEXT_API_KEY = os.getenv("TEXT_API_KEY")
IMAGE_API_KEY = os.getenv("IMAGE_API_KEY")

# API Headers
text_headers = {"Authorization": f"Bearer {TEXT_API_KEY}"}
image_headers = {"Authorization": f"Bearer {IMAGE_API_KEY}"}


@app.route('/contact', methods=['POST'])
def contact_form():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Extract name, email, and message from the request
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # Basic validation
        if not name or not email or not message:
            return jsonify({'message': 'All fields are required!'}), 400
        submission={
            'name':name,
            'email':email,
            'message':message
        }
        contact_collection.insert_one(submission)
        # Respond with a success message
        return jsonify({'message': 'Thank you for your submission!'}), 200

    except Exception as e:
        # Handle any unexpected errors
        print(f"Error occurred: {e}")
        return jsonify({'message': 'An error occurred while processing your request.'}), 500

# Registration route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    # Check if user already exists
    if user_collection.find_one({"username": username}) or user_collection.find_one({"email": email}):
        return jsonify({"error": "User or email already exists"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Insert new user
    user_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password
    })
    return jsonify({"message": "User registered successfully"}), 201

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    # Check if the user exists
    user = user_collection.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check if password matches
    if not check_password_hash(user['password'], password):
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": "Login successful", "redirect": "/generator"}), 200

# Content generation route
@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.get_json()
    prompt = data.get('prompt', '')
    print(f"Received prompt: {prompt}")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Generate text content
    try:
        text_params = {
            "inputs": prompt,
            "parameters": {
                "max_length": 500,
                "min_length": 330,
                "num_return_sequences": 1,
                "eos_token_id": 2,
                "do_sample": True,
                "temperature": 1.0,
                "no_repeat_ngram_size": 2,
            }
        }
        text_response = requests.post(TEXT_API_URL, headers=text_headers, json=text_params)
        if text_response.status_code == 200:
            generated_text = text_response.json()[0].get("generated_text", "")
            if generated_text.startswith(prompt):
                generated_text = generated_text[len(prompt):].strip()
            if not generated_text:
                generated_text = "Unable to generate meaningful content."

            word_count = len(generated_text.split())
            # while word_count < 350:
            #     print(f"Generated text is {word_count} words. Generating more...")
            #     more_text_response = requests.post(TEXT_API_URL, headers=text_headers, json=text_params)
            #     if more_text_response.status_code == 200:
            #         additional_text = more_text_response.json()[0].get("generated_text", "")
            #         generated_text += " " + additional_text
            #         word_count = len(generated_text.split())
            #     else:
            #         break
            print("Text generation successful.")
        else:
            generated_text = "Error generating text"
    except Exception:
        generated_text = "Error generating text"

    # Generate image content
    image_data1=""
    try:
        image_response = requests.post(IMAGE_API_URL, headers=image_headers, json={"inputs": prompt})
        if image_response.status_code == 200:
            image_bytes = BytesIO(image_response.content)
            image_data = base64.b64encode(image_bytes.getvalue()).decode('utf-8')
            image_data1 = f"data:image/png;base64,{base64.b64encode(image_bytes.getvalue()).decode('utf-8')}"
            print("Image generation successful.")
        else:
            image_data = ""
    except Exception:
        image_data = ""

    # Save history to database
    history_collection.insert_one({
        "prompt": prompt,
        "generatedText": generated_text,
        "image": image_data1
    })

    # Return both generated text and image in the response
    return jsonify({
        "generatedText": generated_text,
        "image": image_data
    })

# Fetch history from the database
@app.route('/history', methods=['GET'])
def get_history():
    history = list(history_collection.find({}, {"_id": 0}))
    return jsonify(history)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
