import firebase_admin

from firebase_admin import credentials, firestore, storage, auth 

import os 

 

# Configuración inicial 

def init_firebase(): 

    if not firebase_admin._apps: 

        # Asegúrate de tener el archivo JSON de Firebase en esta ruta 

        cred = credentials.Certificate("backend/firebase/service-account.json") 

        firebase_admin.initialize_app(cred, { 

            'storageBucket': 'tu-app.appspot.com'  # Reemplaza con tu bucket 

        }) 

     

    # Retorna las instancias para usar en otros archivos 

    db = firestore.client() 

    bucket = storage.bucket() 

    auth_client = auth 

     

    return db, bucket, auth_client 