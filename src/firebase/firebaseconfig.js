// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo",
    authDomain: "expo-project-1040e.firebaseapp.com",
    databaseURL: "https://expo-project-1040e-default-rtdb.firebaseio.com",
    projectId: "expo-project-1040e",
    storageBucket: "expo-project-1040e.firebasestorage.app",
    messagingSenderId: "813329495011",
    appId: "1:813329495011:web:931d42531c471fe3e2e6d6",
    measurementId: "G-QY0VQSB12F"
  };
  
  // Inicializar Firebase
  let app;
  let auth;
  let db;
  
  try {
    // Intenta inicializar Firebase
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
  
    // Configuración de Firestore
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);
  
    console.log("Firebase inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
  }
  
  // Exportar las instancias
  export { app, auth, db };