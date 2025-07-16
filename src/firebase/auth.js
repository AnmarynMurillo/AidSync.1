import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

// ... (tu código de inicialización de Firebase)

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(); // Obtén una referencia a Firestore

async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    // Esto te da un objeto con información del usuario que acaba de iniciar sesión.
    const user = result.user;

    console.log("Usuario autenticado:", user);

    // Aquí es donde puedes manejar la integración con Firestore.
    // Usamos el user.uid como ID del documento en Firestore
    // para almacenar información adicional del usuario.
    const userDocRef = doc(db, "users", user.uid);

    // Podemos verificar si el documento del usuario ya existe (opcional, si quieres
    // hacer algo específico solo la primera vez que inicia sesión).
    // Sin embargo, setDoc con merge: true es seguro y actualizará el documento
    // si existe, o lo creará si no.

    // Puedes guardar información básica del usuario, como su nombre y foto.
    // Esto se ejecuta cada vez que inician sesión, pero setDoc es eficiente.
    await setDoc(userDocRef, {
      displayName: user.displayName,
      email: user.email, // Ten en cuenta las reglas de seguridad de Firestore para emails
      photoURL: user.photoURL,
      // Puedes añadir otros campos aquí si los necesitas,
      // como un timestamp de la última conexión
      lastSignInTime: new Date(),
    }, { merge: true }); // merge: true fusiona los datos si el documento ya existe

    console.log("Información del usuario guardada/actualizada en Firestore con UID:", user.uid);

    // Redirige al usuario a la parte principal de tu app, etc.

  } catch (error) {
    // Manejo de errores, por ejemplo, si el usuario cierra el popup
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email; // El email de la cuenta usada, si está disponible
    const credential = GoogleAuthProvider.credentialFromError(error); // Credencial de auth

    console.error("Error durante la autenticación con Google:", errorMessage, errorCode);

    // Aquí puedes mostrar un mensaje al usuario
  }
}

// Llama a esta función, por ejemplo, desde un botón "Iniciar sesión con Google"
// const googleSignInButton = document.getElementById('google-sign-in-button');
// if (googleSignInButton) {
//   googleSignInButton.addEventListener('click', signInWithGoogle);
// }
