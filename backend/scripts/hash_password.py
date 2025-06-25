from werkzeug.security import generate_password_hash
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase Admin SDK (solo si no está inicializado)
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate("../config/firebase_config.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

email = "elpepeinsano@gmail.com"
password = "Tumamamegusta"

# Generar hash de la contraseña
hashed = generate_password_hash(password)

# Buscar usuario y actualizar o crear
users = db.collection('users').where('email', '==', email).get()
if users:
    user_doc = users[0]
    user_doc.reference.update({'password': hashed})
    print("Contraseña actualizada y hasheada correctamente.")
else:
    db.collection('users').add({'email': email, 'password': hashed})
    print("Usuario creado en Firestore con contraseña hasheada.")