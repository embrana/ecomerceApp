import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from api.utils import APIException, generate_sitemap
from api.routes import api
from api.models import db
from api.admin import setup_admin
from api.commands import setup_commands

app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key"  # Replace with a secure key
db.init_app(app)
MIGRATE = Migrate(app, db)

# Initialize JWT Manager
jwt = JWTManager(app)

# Register Blueprints and Admin
app.register_blueprint(api, url_prefix='/api')
setup_admin(app)
setup_commands(app)

# Error handling
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Sitemap
@app.route('/')
def sitemap():
    return generate_sitemap(app)

# Serve static files
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# Main entry point
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
