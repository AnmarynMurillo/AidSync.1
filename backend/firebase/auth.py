from . import init_firebase 

 

db, bucket, auth = init_firebase() 

 

def crear_usuario(email, password, nombre): 

    try: 

        user = auth.create_user( 

            email=email, 

            password=password, 

            display_name=nombre 

        ) 

        return {'success': True, 'user': user} 

    except Exception as e: 

        return {'success': False, 'error': str(e)} 

 

def verificar_usuario(id_token): 

    try: 

        decoded_token = auth.verify_id_token(id_token) 

        return {'success': True, 'user': decoded_token} 

    except Exception as e: 

        return {'success': False, 'error': str(e)} 