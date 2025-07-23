# app.py
# ---
# Backend principal para autenticación con Flask y Firebase
# ---

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Inicializa variables de entorno
load_dotenv()

# Inicializa la app Flask
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'supersecretkey')  # Cambia esto en producción
CORS(app)

# Inicializa Firebase (importa el módulo que creamos)
from src.auth.firebase_admin_init import *
from firebase_admin import auth

# --- Endpoint para login ---
@app.route('/login', methods=['POST'])
def login():
    """
    Recibe email y password, verifica en Firebase y responde si el usuario existe o no.
    """
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'success': False, 'message': 'Email y contraseña requeridos'}), 400
    try:
        # Firebase no permite verificar password directamente desde admin SDK,
        # así que normalmente esto se hace en el frontend con Firebase JS SDK.
        # Pero para fines de backend, puedes usar Firebase REST API:
        import requests
        api_key = os.getenv('FIREBASE_API_KEY')
        url = f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}'
        payload = {
            'email': email,
            'password': password,
            'returnSecureToken': True
        }
        r = requests.post(url, json=payload)
        resp = r.json()
        if 'idToken' in resp:
            # Usuario autenticado correctamente
            session['user'] = resp['email']
            return jsonify({'success': True, 'message': 'Login exitoso', 'user': resp['email']}), 200
        else:
            return jsonify({'success': False, 'message': resp.get('error', {}).get('message', 'Usuario o contraseña incorrectos')}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# --- Endpoint para registro ---
@app.route('/register', methods=['POST'])
def register():
    """
    Recibe email y password, crea usuario en Firebase.
    """
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'success': False, 'message': 'Email y contraseña requeridos'}), 400
    try:
        user = auth.create_user(email=email, password=password)
        return jsonify({'success': True, 'message': 'Usuario creado', 'uid': user.uid}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

# --- Endpoint para cerrar sesión ---
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'success': True, 'message': 'Sesión cerrada'}), 200

# --- Endpoint para verificar si usuario está logueado ---
@app.route('/check_session', methods=['GET'])
def check_session():
    user = session.get('user')
    if user:
        return jsonify({'logged_in': True, 'user': user})
    else:
        return jsonify({'logged_in': False}), 200

if __name__ == '__main__':
    app.run(debug=True)
