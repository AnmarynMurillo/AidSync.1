# backend/scripts/hash_password.py
#este archivo es hash_password.py y es el archivo que se encarga de hashear la contraseña de los usuarios

from werkzeug.security import generate_password_hash
import firebase_admin
from firebase_admin import credentials, firestore

try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate("../config/firebase_config.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def create_or_update_user(email, password, name=None):
    try:
        # Generar hash de la contraseña
        password_hash = generate_password_hash(password)
        
        # Buscar si el usuario ya existe
        users = db.collection('users').where('email', '==', email).get()
        
        if users:
            # Actualizar usuario existente
            user_ref = db.collection('users').document(users[0].id)
        else:
            # Crear nuevo usuario
            # Primero crear en Firebase Authentication
            user = auth.create_user(
                email=email,
                password=password,
                display_name=name or email.split('@')[0]
            )
            user_ref = db.collection('users').document(user.uid)
        
        # Guardar información en Firestore
        user_ref.set({
            'email': email,
            'password_hash': password_hash,
            'name': name or email.split('@')[0],
            'created_at': firestore.SERVER_TIMESTAMP
        })
        
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

# Ejemplo de uso
email = "elpepeinsano@gmail.com"
password = "Tumamamegusta"
name = "Pepe Insano"

if create_or_update_user(email, password, name):
    print("Usuario creado/actualizado exitosamente")
else:
    print("Error al crear/actualizar usuario")