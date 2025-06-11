from flask import Flask, request, jsonify 

from firebase.auth import crear_usuario, verificar_usuario 

from firebase.firestore import crear_documento, leer_documento 

from firebase.storage import subir_archivo 

import os 

 

app = Flask(__name__) 

 

# Configuración 

UPLOAD_FOLDER = 'temp_uploads' 

os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

 

@app.route('/api/auth/register', methods=['POST']) 

def register(): 

    data = request.json 

    result = crear_usuario(data['email'], data['password'], data.get('nombre', '')) 

    return jsonify(result) 

 

@app.route('/api/auth/verify', methods=['POST']) 

def verify(): 

    id_token = request.json.get('token') 

    result = verificar_usuario(id_token) 

    return jsonify(result) 

 

@app.route('/api/firestore/add', methods=['POST']) 

def add_to_firestore(): 

    data = request.json 

    result = crear_documento( 

        data['collection'], 

        data['data'], 

        data.get('doc_id') 

    ) 

    return jsonify(result) 

 

@app.route('/api/firestore/get', methods=['GET']) 

def get_from_firestore(): 

    collection = request.args.get('collection') 

    doc_id = request.args.get('doc_id') 

    result = leer_documento(collection, doc_id) 

    return jsonify(result) 

 

@app.route('/api/storage/upload', methods=['POST']) 

def upload_file(): 

    if 'file' not in request.files: 

        return jsonify({'success': False, 'error': 'No file provided'}) 

     

    file = request.files['file'] 

    if file.filename == '': 

        return jsonify({'success': False, 'error': 'No file selected'}) 

     

    # Guardar temporalmente 

    temp_path = os.path.join(UPLOAD_FOLDER, file.filename) 

    file.save(temp_path) 

     

    # Subir a Firebase 

    remote_path = f"uploads/{file.filename}" 

    result = subir_archivo(temp_path, remote_path) 

     

    # Eliminar temporal 

    os.remove(temp_path) 

     

    return jsonify(result) 

 

if __name__ == '__main__': 

    app.run(debug=True, port=5000) 