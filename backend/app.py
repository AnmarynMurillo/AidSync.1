from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Inicializar Firebase Admin SDK
cred = credentials.Certificate("config/firebase_config.json")
firebase_admin.initialize_app(cred)

# Inicializar servicios
db = firestore.client()

from werkzeug.security import check_password_hash

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Buscar usuario por email en la colección 'users'
    user_ref = db.collection('users').where('email', '==', email).get()
    if not user_ref:
        return jsonify({'message': 'User not found'}), 401

    user_doc = user_ref[0]
    user_data = user_doc.to_dict()

    # Verificar contraseña (debe estar hasheada en la base de datos)
    if not check_password_hash(user_data['password'], password):
        return jsonify({'message': 'Incorrect password'}), 401

    # Para demo: usar el id del documento como token (en producción usa JWT)
    token = user_doc.id

    return jsonify({'token': token, 'user': {'email': user_data['email']}})

@app.route('/api/auth/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        user = auth.create_user(
            email=data['email'],
            password=data['password'],
            display_name=data.get('display_name', '')
        )
        return jsonify({'message': 'Usuario creado exitosamente', 'uid': user.uid}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/pets', methods=['POST'])
def create_pet():
    try:
        data = request.json
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        # Crear documento en Firestore
        pet_ref = db.collection('pets').document()
        pet_ref.set({
            'name': data['name'],
            'type': data['type'],
            'owner_id': decoded_token['uid'],
            'created_at': firestore.SERVER_TIMESTAMP
        })
        return jsonify({'message': 'Mascota creada exitosamente', 'id': pet_ref.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/pets', methods=['GET'])
def get_pets():
    try:
        # Verificar token de autenticación
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        # Obtener mascotas del usuario
        pets = db.collection('pets').where('owner_id', '==', decoded_token['uid']).stream()
        pets_list = [{'id': pet.id, **pet.to_dict()} for pet in pets]
        return jsonify(pets_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/')
def home():
    return 'Flask is working!'

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')