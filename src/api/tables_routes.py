from flask import Blueprint, jsonify, request
from api.models import db, Table
from flask_jwt_extended import jwt_required

# Crear un blueprint separado para las rutas de tablas
tables_bp = Blueprint('tables', __name__)

@tables_bp.route('/list', methods=['GET'])
def get_tables():
    """
    Retrieve all tables with simplified serialization
    """
    try:
        tables = Table.query.all()
        # Serialización manual para evitar problemas
        tables_serialized = []
        for table in tables:
            table_data = {
                "id": table.id,
                "number": table.number,
                "name": table.name,
                "capacity": table.capacity,
                "is_occupied": table.is_occupied,
                # No incluir active_order para evitar recursión
            }
            tables_serialized.append(table_data)
        
        return jsonify({"tables": tables_serialized}), 200
    except Exception as e:
        print(f"Error fetching tables (simple): {e}")
        return jsonify({"msg": f"Error: {str(e)}"}), 500