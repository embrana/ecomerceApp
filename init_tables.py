import requests
import json
import sys

# URL de la API 
API_URL = "https://glorious-capybara-j97jpq4949535x79-3001.app.github.dev"

def get_tables():
    """Obtener todas las mesas"""
    try:
        response = requests.get(f"{API_URL}/api/tables")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error obteniendo mesas: {e}")
        return {"tables": []}

def create_table(number, name=None, capacity=4):
    """Crear una nueva mesa"""
    # Generalmente necesitaríamos un token, pero para fines de ejemplo podríamos omitirlo
    try:
        data = {
            "number": number,
            "name": name or f"Mesa {number}",
            "capacity": capacity
        }
        response = requests.post(f"{API_URL}/api/tables", json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creando mesa: {e}")
        return None

def main():
    # Obtener mesas actuales
    tables_data = get_tables()
    current_tables = tables_data.get("tables", [])
    
    print(f"Tablas actuales en el sistema: {len(current_tables)}")
    
    # Si hay menos de 5 mesas, crear 5 mesas más
    if len(current_tables) < 5:
        for i in range(1, 6):
            # Verificar si esta mesa ya existe (por número)
            if not any(table.get("number") == i for table in current_tables):
                result = create_table(i)
                if result:
                    print(f"Mesa {i} creada correctamente")
                else:
                    print(f"Error al crear mesa {i}")
    
    # Obtener mesas actualizadas
    tables_data = get_tables()
    updated_tables = tables_data.get("tables", [])
    
    print(f"Tablas después de la inicialización: {len(updated_tables)}")
    for table in updated_tables:
        print(f"  - Mesa {table.get('number')}: {table.get('name')} (Capacidad: {table.get('capacity')})")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--url":
        if len(sys.argv) > 2:
            API_URL = sys.argv[2]
        else:
            print("Debe proporcionar una URL después de --url")
            sys.exit(1)
    
    print(f"Usando API URL: {API_URL}")
    main()