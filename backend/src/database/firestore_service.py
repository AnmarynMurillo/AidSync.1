import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import jsonify

# Inicializar Firebase solo si no está inicializado
if not firebase_admin._apps:
    cred = credentials.Certificate('backend/config/firebase_config.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ------------------- SERVICIO DE OPORTUNIDADES DE VOLUNTARIADO -------------------

def create_volunteer_opportunity(request):
    """
    Crea una oportunidad de voluntariado:
    1. Verifica el ID Token enviado en el header Authorization.
    2. Si es válido, crea una oportunidad en la colección 'volunteer_opportunities'.
    """
    try:
        data = request.json
        # Obtener el token del header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        
        # Crear documento en Firestore
        opportunity_ref = db.collection('volunteer_opportunities').document()
        opportunity_ref.set({
            'title': data['title'],
            'description': data['description'],
            'organization': data['organization'],
            'location': data['location'],
            'date': data['date'],
            'duration': data['duration'],  # en horas
            'max_volunteers': data.get('max_volunteers', 10),  # máximo de voluntarios
            'required_skills': data.get('required_skills', []),  # habilidades requeridas
            'category': data.get('category', 'General'),  # educación, salud, ambiente, etc.
            'contact_email': data.get('contact_email', ''),
            'status': 'active',  # active, completed, cancelled
            'created_by': decoded_token['uid'],  # usuario que creó la oportunidad
            'created_at': firestore.SERVER_TIMESTAMP,
            'volunteers_registered': []  # lista de UIDs de voluntarios registrados
        })
        
        return jsonify({
            'message': 'Oportunidad de voluntariado creada exitosamente', 
            'id': opportunity_ref.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_volunteer_opportunities(request):
    """
    Obtiene todas las oportunidades de voluntariado activas:
    1. Verifica el ID Token (opcional para ver oportunidades).
    2. Retorna todas las oportunidades activas.
    """
    try:
        # Obtener todas las oportunidades activas
        opportunities = db.collection('volunteer_opportunities')\
                         .where('status', '==', 'active')\
                         .order_by('created_at', direction=firestore.Query.DESCENDING)\
                         .stream()
        
        opportunities_list = []
        for opp in opportunities:
            opp_data = opp.to_dict()
            opp_data['id'] = opp.id
            # Convertir timestamp a string si existe
            if 'created_at' in opp_data and opp_data['created_at']:
                opp_data['created_at'] = opp_data['created_at'].isoformat()
            opportunities_list.append(opp_data)
        
        return jsonify(opportunities_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def register_for_volunteer_opportunity(request, opportunity_id):
    """
    Registra a un usuario en una oportunidad de voluntariado:
    1. Verifica el ID Token del usuario.
    2. Añade el usuario a la lista de voluntarios registrados.
    """
    try:
        # Obtener el token del header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        user_uid = decoded_token['uid']
        
        # Obtener la oportunidad
        opportunity_ref = db.collection('volunteer_opportunities').document(opportunity_id)
        opportunity = opportunity_ref.get()
        
        if not opportunity.exists:
            return jsonify({'error': 'Oportunidad no encontrada'}), 404
        
        opportunity_data = opportunity.to_dict()
        
        # Verificar si ya está registrado
        if user_uid in opportunity_data.get('volunteers_registered', []):
            return jsonify({'error': 'Ya estás registrado en esta oportunidad'}), 400
        
        # Verificar si hay cupo disponible
        current_volunteers = len(opportunity_data.get('volunteers_registered', []))
        max_volunteers = opportunity_data.get('max_volunteers', 10)
        
        if current_volunteers >= max_volunteers:
            return jsonify({'error': 'No hay cupos disponibles'}), 400
        
        # Registrar al voluntario
        opportunity_ref.update({
            'volunteers_registered': firestore.ArrayUnion([user_uid])
        })
        
        return jsonify({'message': 'Registrado exitosamente en la oportunidad de voluntariado'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_user_volunteer_registrations(request):
    """
    Obtiene las oportunidades de voluntariado en las que el usuario está registrado:
    1. Verifica el ID Token del usuario.
    2. Retorna todas las oportunidades donde el usuario está registrado.
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        user_uid = decoded_token['uid']
        
        # Buscar oportunidades donde el usuario está registrado
        opportunities = db.collection('volunteer_opportunities')\
                         .where('volunteers_registered', 'array_contains', user_uid)\
                         .stream()
        
        opportunities_list = []
        for opp in opportunities:
            opp_data = opp.to_dict()
            opp_data['id'] = opp.id
            # Convertir timestamp a string si existe
            if 'created_at' in opp_data and opp_data['created_at']:
                opp_data['created_at'] = opp_data['created_at'].isoformat()
            opportunities_list.append(opp_data)
        
        return jsonify(opportunities_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_user_created_opportunities(request):
    """
    Obtiene las oportunidades de voluntariado creadas por el usuario:
    1. Verifica el ID Token del usuario.
    2. Retorna todas las oportunidades creadas por ese usuario.
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        
        # Obtener oportunidades creadas por el usuario
        opportunities = db.collection('volunteer_opportunities')\
                         .where('created_by', '==', decoded_token['uid'])\
                         .order_by('created_at', direction=firestore.Query.DESCENDING)\
                         .stream()
        
        opportunities_list = []
        for opp in opportunities:
            opp_data = opp.to_dict()
            opp_data['id'] = opp.id
            # Convertir timestamp a string si existe
            if 'created_at' in opp_data and opp_data['created_at']:
                opp_data['created_at'] = opp_data['created_at'].isoformat()
            opportunities_list.append(opp_data)
        
        return jsonify(opportunities_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    
    # TODO ESTO NO FUNCIONA, SOLAMENTE DE EJEMPLO