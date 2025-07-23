# Inicializa Firebase Admin SDK usando la configuración del archivo JSON
import firebase_admin
from firebase_admin import credentials, auth
import os

# Ruta al archivo de configuración
FIREBASE_CONFIG_PATH = os.path.join(os.path.dirname(__file__), '../../config/firebase_config.json')

# Inicialización global (solo si no está ya inicializado)
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CONFIG_PATH)
    firebase_admin.initialize_app(cred)
