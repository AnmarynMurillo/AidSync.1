import firebase_admin
from firebase_admin import credentials, auth
from flask import Flask, request, jsonify
import os
from werkzeug.security import check_password_hash

app = Flask(__name__)

# Inicializar Firebase Admin SDK
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate('../config/firebase_config.json')
    firebase_admin.initialize_app(cred)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Obtener datos del request
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'success': False, 'message': 'Datos inválidos'}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email y contraseña son requeridos'}), 400
            
        # Verificar si el usuario existe en Firebase
        try:
            user = auth.get_user_by_email(email)
        except auth.UserNotFoundError:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 401
            
        # Buscar el hash de la contraseña en Firestore
        db = firebase_admin.firestore.client()
        user_doc = db.collection('users').document(user.uid).get()
        
        if not user_doc.exists:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 401
            
        user_data = user_doc.to_dict()
        password_hash = user_data.get('password_hash')
        
        if not password_hash:
            return jsonify({'success': False, 'message': 'Usuario inválido'}), 401
            
        # Verificar la contraseña usando el hash almacenado
        if check_password_hash(password_hash, password):
            response = {
                'success': True,
                'user': {
                    'uid': user.uid,
                    'email': user.email,
                    'name': user.display_name or email.split('@')[0]
                }
            }
            return jsonify(response)
        else:
            return jsonify({'success': False, 'message': 'Contraseña incorrecta'}), 401
            
    except Exception as e:
        print(f"Error en login: {str(e)}")  # Log para debugging
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        # Implementar la lógica de logout
        response = {
            'success': True,
            'message': 'Logout successful'
        }
        return jsonify(response)
    except Exception as e:
        print(f"Error en logout: {str(e)}")  # Log para debugging
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True)
