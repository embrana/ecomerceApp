import sys
import os

# Add the src directory to the path
sys.path.append(os.path.abspath('src'))

# Create a simple Flask app for debugging
from flask import Flask, jsonify
from api.models import db, Table

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test_debug.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/debug/create_tables', methods=['GET'])
def create_tables():
    """Create the tables and add some sample data"""
    with app.app_context():
        try:
            # Create tables
            db.create_all()
            
            # Add sample tables if none exist
            if Table.query.count() == 0:
                for i in range(1, 6):
                    table = Table(number=i, name=f"Mesa {i}", capacity=4, is_occupied=False)
                    db.session.add(table)
                db.session.commit()
                
            count = Table.query.count()
            tables = [t.serialize() for t in Table.query.all()]
            
            return jsonify({
                "message": f"Tables created successfully. Total: {count}",
                "tables": tables
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/debug/tables', methods=['GET'])
def get_tables():
    """Get all tables"""
    with app.app_context():
        try:
            tables = Table.query.all()
            serialized = []
            
            # Manually serialize to avoid errors
            for table in tables:
                table_data = {
                    "id": table.id,
                    "number": table.number,
                    "name": table.name,
                    "capacity": table.capacity,
                    "is_occupied": table.is_occupied
                }
                
                # Safely get active order
                try:
                    active_order = None
                    # Don't call get_active_order to avoid potential errors
                    serialized.append(table_data)
                except Exception as e:
                    print(f"Error serializing table {table.id}: {e}")
                    serialized.append(table_data)
            
            return jsonify({"tables": serialized}), 200
        except Exception as e:
            print(f"Error in get_tables: {e}")
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)