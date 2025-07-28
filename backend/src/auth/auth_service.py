#este archivo es auth_service.py y es el archivo que se encarga de la logica de la autenticacion

import firebase_admin
from firebase_admin import credentials, auth
from flask import jsonify
from functools import wraps
import json

# Inicializar Firebase solo si no está inicializado
if not firebase_admin._apps:
    cred = credentials.Certificate('/backend/config/firebase_config.json')
    firebase_admin.initialize_app(cred)

# ------------------- DECORADOR PARA VERIFICAR TOKEN -------------------

def token_required(f):
    """
    Decorador para verificar que el usuario esté autenticado
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        request = args[0]  # El request siempre es el primer argumento
        
        # Buscar el token en el header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer TOKEN
            except IndexError:
                return jsonify({'error': 'Token mal formateado'}), 401
        
        if not token:
            return jsonify({'error': 'Token faltante'}), 401
        
        try:
            # Verificar el token con Firebase
            decoded_token = auth.verify_id_token(token)
            request.current_user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': f'Token inválido: {str(e)}'}), 401
    
    return decorated

# ------------------- SERVICIOS DE AUTENTICACIÓN -------------------

def login_user(request):
    """
    Lógica de login:
    Como mencionamos, el login se hace en el cliente con Firebase Auth.
    Este endpoint solo sirve para validar que el token funciona.
    """
    data = request.json
    
    # Si recibe email y password, informar que debe usar el cliente
    if 'email' in data and 'password' in data:
        return jsonify({
            'error': 'El login con email/contraseña debe hacerse desde el cliente usando Firebase Auth.',
            'instructions': 'Usa firebase.auth().signInWithEmailAndPassword(email, password) en el frontend'
        }), 400
    
    # Si recibe un token, validarlo
    if 'token' in data:
        try:
            decoded_token = auth.verify_id_token(data['token'])
            return jsonify({
                'message': 'Token válido',
                'user': {
                    'uid': decoded_token['uid'],
                    'email': decoded_token.get('email'),
                    'email_verified': decoded_token.get('email_verified', False)
                }
            }), 200
        except Exception as e:
            return jsonify({'error': f'Token inválido: {str(e)}'}), 401
    
    return jsonify({'error': 'Datos insuficientes'}), 400

def register_user(request):
    """
    Lógica de registro:
    1. Recibe email y contraseña.
    2. Crea el usuario en Firebase Auth.
    3. Devuelve el UID del usuario creado.
    """
    data = request.json
    
    # Validar datos requeridos
    required_fields = ['email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Campo requerido: {field}'}), 400
    
    try:
        # Crear usuario en Firebase Auth
        user = auth.create_user(
            email=data['email'],
            password=data['password'],
            display_name=data.get('display_name', ''),
            email_verified=False
        )
        
        return jsonify({
            'message': 'Usuario creado exitosamente',
            'uid': user.uid,
            'email': user.email
        }), 201
        
    except auth.EmailAlreadyExistsError:
        return jsonify({'error': 'El email ya está registrado'}), 409
    except auth.InvalidEmailError:
        return jsonify({'error': 'Email no válido'}), 400
    except auth.WeakPasswordError:
        return jsonify({'error': 'Contraseña muy débil'}), 400
    except Exception as e:
        return jsonify({'error': f'Error al crear usuario: {str(e)}'}), 500

def get_current_user(request):
    """
    Obtener información del usuario actual desde el token
    """
    try:
        # Obtener token del header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        decoded_token = auth.verify_id_token(token)
        
        # Obtener información adicional del usuario
        user = auth.get_user(decoded_token['uid'])
        
        return jsonify({
            'uid': user.uid,
            'email': user.email,
            'display_name': user.display_name,
            'email_verified': user.email_verified,
            'creation_time': user.user_metadata.creation_timestamp,
            'last_sign_in': user.user_metadata.last_sign_in_timestamp
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error al obtener usuario: {str(e)}'}), 401

def verify_token(request):
    """
    Endpoint simple para verificar si un token es válido
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        decoded_token = auth.verify_id_token(token)
        
        return jsonify({
            'valid': True,
            'uid': decoded_token['uid'],
            'email': decoded_token.get('email')
        }), 200
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'error': str(e)
        }), 401
