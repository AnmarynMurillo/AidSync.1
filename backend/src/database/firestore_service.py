import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import jsonify

# Inicializar Firebase solo si no está inicializado
if not firebase_admin._apps:
    cred = credentials.Certificate('backend/config/firebase_config.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ------------------- SERVICIO DE LUGARES DE VOLUNTARIADO -------------------

def create_volunteer_location(request):
    """
    Crea un lugar donde se pueden realizar actividades de voluntariado:
    1. Verifica el ID Token enviado en el header Authorization.
    2. Si es válido, crea un lugar en la colección 'volunteer_locations'.
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
        location_ref = db.collection('volunteer_locations').document()
        location_ref.set({
            'name': data['name'],  # Nombre del lugar
            'address': data['address'],  # Dirección completa
            'district': data.get('district', ''),  # Distrito (Panamá, San Miguelito, etc.)
            'province': data.get('province', 'Panamá'),  # Provincia
            'coordinates': {
                'latitude': data.get('latitude', 0.0),
                'longitude': data.get('longitude', 0.0)
            },
            'description': data.get('description', ''),  # Descripción del lugar
            'type': data.get('type', 'General'),  # hospital, escuela, parque, comunidad, etc.
            'contact_person': data.get('contact_person', ''),  # Persona de contacto
            'contact_phone': data.get('contact_phone', ''),
            'contact_email': data.get('contact_email', ''),
            'accessibility': data.get('accessibility', ''),  # Info sobre accesibilidad
            'facilities': data.get('facilities', []),  # baños, parking, agua, etc.
            'transportation': data.get('transportation', ''),  # Cómo llegar
            'status': 'active',  # active, inactive
            'created_by': decoded_token['uid'],
            'created_at': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({
            'message': 'Lugar de voluntariado creado exitosamente', 
            'id': location_ref.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_volunteer_locations(request):
    """
    Obtiene todos los lugares de voluntariado activos:
    1. Retorna todos los lugares activos ordenados por nombre.
    """
    try:
        # Obtener todos los lugares activos
        locations = db.collection('volunteer_locations')\
                     .where('status', '==', 'active')\
                     .order_by('name')\
                     .stream()
        
        locations_list = []
        for loc in locations:
            loc_data = loc.to_dict()
            loc_data['id'] = loc.id
            # Convertir timestamp a string si existe
            if 'created_at' in loc_data and loc_data['created_at']:
                loc_data['created_at'] = loc_data['created_at'].isoformat()
            locations_list.append(loc_data)
        
        return jsonify(locations_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_locations_by_district(request, district):
    """
    Obtiene lugares de voluntariado filtrados por distrito:
    1. Retorna lugares del distrito especificado.
    """
    try:
        locations = db.collection('volunteer_locations')\
                     .where('status', '==', 'active')\
                     .where('district', '==', district)\
                     .order_by('name')\
                     .stream()
        
        locations_list = []
        for loc in locations:
            loc_data = loc.to_dict()
            loc_data['id'] = loc.id
            if 'created_at' in loc_data and loc_data['created_at']:
                loc_data['created_at'] = loc_data['created_at'].isoformat()
            locations_list.append(loc_data)
        
        return jsonify(locations_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_locations_by_type(request, location_type):
    """
    Obtiene lugares de voluntariado filtrados por tipo:
    1. Retorna lugares del tipo especificado (hospital, escuela, etc.).
    """
    try:
        locations = db.collection('volunteer_locations')\
                     .where('status', '==', 'active')\
                     .where('type', '==', location_type)\
                     .order_by('name')\
                     .stream()
        
        locations_list = []
        for loc in locations:
            loc_data = loc.to_dict()
            loc_data['id'] = loc.id
            if 'created_at' in loc_data and loc_data['created_at']:
                loc_data['created_at'] = loc_data['created_at'].isoformat()
            locations_list.append(loc_data)
        
        return jsonify(locations_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def update_volunteer_location(request, location_id):
    """
    Actualiza un lugar de voluntariado:
    1. Verifica que el usuario sea quien creó el lugar.
    2. Actualiza los campos proporcionados.
    """
    try:
        data = request.json
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        user_uid = decoded_token['uid']
        
        # Verificar que el lugar existe y fue creado por el usuario
        location_ref = db.collection('volunteer_locations').document(location_id)
        location = location_ref.get()
        
        if not location.exists:
            return jsonify({'error': 'Lugar no encontrado'}), 404
        
        location_data = location.to_dict()
        if location_data.get('created_by') != user_uid:
            return jsonify({'error': 'No tienes permisos para actualizar este lugar'}), 403
        
        # Actualizar campos
        update_data = {}
        allowed_fields = ['name', 'address', 'district', 'province', 'description', 
                         'type', 'contact_person', 'contact_phone', 'contact_email',
                         'accessibility', 'facilities', 'transportation', 'status']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if 'latitude' in data or 'longitude' in data:
            coordinates = location_data.get('coordinates', {})
            if 'latitude' in data:
                coordinates['latitude'] = data['latitude']
            if 'longitude' in data:
                coordinates['longitude'] = data['longitude']
            update_data['coordinates'] = coordinates
        
        if update_data:
            update_data['updated_at'] = firestore.SERVER_TIMESTAMP
            location_ref.update(update_data)
        
        return jsonify({'message': 'Lugar actualizado exitosamente'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

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
            'location_id': data.get('location_id', ''),  # ID del lugar de la colección locations
            'location_name': data.get('location_name', ''),  # Nombre del lugar (para referencia rápida)
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