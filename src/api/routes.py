from flask import request, jsonify, Blueprint
from api.models import db, User, Product
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.utils import APIException

import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

import os

cloudinary.config( 
    cloud_name = "dnmm7omko", 
    api_key = "412312661645263", 
    api_secret = os.getenv("CLOUDINARY_SECRET", ""),
    secure=True
)


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
    Handle user login and return a JWT token with a redirect route based on user role.
    """
    body = request.get_json()

    if not body or "email" not in body or "password" not in body:
        return jsonify({"msg": "Missing email or password"}), 400

    email = body.get("email")
    password = body.get("password")

    # Fetch user from the database
    user = User.query.filter_by(email=email, password=password).first()

    if user:
        # Determine the redirection route based on user role
        if user.is_cliente:
            redirect_url = '/menu'
        elif user.is_cocina:
            redirect_url = '/dashboard/cocina'
        elif user.is_admin:
            redirect_url = '/dashboard/cocina'
        else:
            redirect_url = '/'  # Default route for unassigned roles

        # Generate a JWT token
        access_token = create_access_token(identity={"id": user.id, "email": user.email})
        
        return jsonify({"token": access_token, "redirect_url": redirect_url}), 200

    return jsonify({"msg": "Invalid email or password"}), 401


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """
    A protected route that requires a valid JWT token.
    """
    current_user = get_jwt_identity()
    return jsonify({"msg": "Access granted", "user": current_user}), 200


@api.route('/products', methods=['POST'])
def create_product():
    """
    Create a new product.
    """
    body = request.form

    # Validate required fields
    if not body or "name" not in body or "description" not in body or "type" not in body or "stock" not in body:
        raise APIException("Missing product field", status_code=400)

    name = body.get("name")
    description = body.get("description")
    type = body.get("type")
    stock = body.get("stock")

    # Log the received stock value for debugging
    print(f"Received stock value: {stock}")

    # Validate stock as a positive integer
    if not stock.isdigit() or int(stock) < 0:
        raise APIException("Invalid stock value", status_code=400)

    stock = int(stock)  # Convert stock to an integer after validation

    # Handle file upload for image
    image = request.files.get("image")
    if not image:
        raise APIException("Image is required", status_code=400)

    try:
        upload_result = cloudinary.uploader.upload(image)
        image_url = upload_result["secure_url"]
    except Exception as e:
        raise APIException(f"Error uploading image: {str(e)}", status_code=500)

    # Create new product
    new_product = Product(
        name=name, 
        description=description,
        type=type,
        stock=stock,
        is_active=True,  # Default to True for new products
        image=image_url
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify({"msg": "Product created successfully"}), 200


@api.route('/products', methods=['GET'])
def get_products():
    """
    Get all products.
    """
    products = Product.query.all()
    products = list(map(lambda x: x.serialize(), products))
    return jsonify(products), 200