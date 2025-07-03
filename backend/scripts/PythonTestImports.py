try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    print("✅ Firebase importado correctamente")
except ImportError as e:
    print(f"❌ Error con Firebase: {e}")

try:
    from flask import Flask
    print("✅ Flask importado correctamente")
except ImportError as e:
    print(f"❌ Error con Flask: {e}")