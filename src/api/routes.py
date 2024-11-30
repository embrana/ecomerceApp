from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.utils import APIException

api = Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend."
    }
    return jsonify(response_body), 200

@api.route('/login', methods=['POST'])
def login():
    """
    Handle user login and return a JWT token.
    """
    body = request.get_json()

    if not body or "email" not in body or "password" not in body:
        return jsonify({"msg": "Missing email or password"}), 400

    email = body.get("email")
    password = body.get("password")

    # Fetch user from the database
    user = User.query.filter_by(email=email, password=password).first()
    if user:
        # Generate a JWT token
        access_token = create_access_token(identity={"id": user.id, "email": user.email})
        return jsonify({"token": access_token}), 200

    return jsonify({"msg": "Invalid email or password"}), 401

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """
    A protected route that requires a valid JWT token.
    """
    current_user = get_jwt_identity()
    return jsonify({"msg": "Access granted", "user": current_user}), 200
