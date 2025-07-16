#este archivo es app.py y es el archivo principal de la aplicacion

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Importar los servicios
from src.auth.auth_service import (
    login_user, 
    register_user, 
    get_current_user, 
    verify_token,
    token_required
)
from src.database.firestore_service import get_user_pets, create_pet_for_user

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# ------------------- RUTAS DE AUTENTICACIÓN -------------------

@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Endpoint de login - principalmente para validar tokens
    """
    return login_user(request)

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    Endpoint de registro - crear usuario en Firebase Auth
    """
    return register_user(request)

@app.route('/api/auth/user', methods=['GET'])
def get_user():
    """
    Obtener información del usuario actual
    Requiere token de autenticación
    """
    return get_current_user(request)

@app.route('/api/auth/verify', methods=['GET'])
def verify():
    """
    Verificar si un token es válido
    """
    return verify_token(request)

# ------------------- RUTAS DE MASCOTAS (PROTEGIDAS) -------------------

@app.route('/api/pets', methods=['POST'])
@token_required
def create_pet():
    """
    Crear una nueva mascota
    Requiere autenticación
    """
    return create_pet_for_user(request)

@app.route('/api/pets', methods=['GET'])
@token_required
def get_pets():
    """
    Obtener mascotas del usuario actual
    Requiere autenticación
    """
    return get_user_pets(request)

# ------------------- RUTAS DE PRUEBA -------------------

@app.route('/')
def home():
    """
    Endpoint de prueba
    """
    return jsonify({
        'message': 'AidSync API funcionando!',
        'version': '1.0.0',
        'endpoints': {
            'auth': {
                'POST /api/auth/login': 'Validar token de login',
                'POST /api/auth/register': 'Registrar nuevo usuario',
                'GET /api/auth/user': 'Obtener usuario actual (requiere token)',
                'GET /api/auth/verify': 'Verificar token (requiere token)'
            },
            'pets': {
                'POST /api/pets': 'Crear mascota (requiere token)',
                'GET /api/pets': 'Obtener mascotas (requiere token)'
            }
        }
    })

@app.route('/api/test', methods=['GET'])
@token_required
def test_auth():
    """
    Endpoint de prueba que requiere autenticación
    """
    user = request.current_user
    return jsonify({
        'message': '¡Autenticación exitosa!',
        'user': {
            'uid': user['uid'],
            'email': user.get('email'),
            'email_verified': user.get('email_verified', False)
        },
        'timestamp': user.get('iat')
    })

# ------------------- MANEJO DE ERRORES -------------------

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({'error': 'No autorizado'}), 401

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')