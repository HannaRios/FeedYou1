import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import axios from "axios";
import { AuthProvider } from "./context/AuthContext.jsx";


axios.defaults.withCredentials = true;

const GOOGLE_CLIENT_ID = "7648418726-1cdh45duout86h21vs9j9t56uivi7758.apps.googleusercontent.com";

// Verificación en consola
console.log("Client ID cargado:", GOOGLE_CLIENT_ID);
console.log("¿Es undefined?", GOOGLE_CLIENT_ID === undefined);
console.log("Longitud:", GOOGLE_CLIENT_ID?.length);

if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "TU_CLIENT_ID_AQUI") {
  console.error("ERROR: GOOGLE_CLIENT_ID no está configurado correctamente");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
)