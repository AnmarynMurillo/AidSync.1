from . import init_firebase 

import os 

from datetime import datetime, timedelta 

 

db, bucket, auth = init_firebase() 

 

def subir_archivo(archivo_local, ruta_remota): 

    try: 

        blob = bucket.blob(ruta_remota) 

        blob.upload_from_filename(archivo_local) 

         

        # Generar URL pública 

        url = blob.generate_signed_url( 

            version="v4", 

            expiration=timedelta(days=7), 

            method="GET" 

        ) 

         

        return {'success': True, 'url': url} 

    except Exception as e: 

        return {'success': False, 'error': str(e)} 

 

def eliminar_archivo(ruta_remota): 

    try: 

        blob = bucket.blob(ruta_remota) 

        blob.delete() 

        return {'success': True} 

    except Exception as e: 

        return {'success': False, 'error': str(e)} 