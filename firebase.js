// firebase.js (ESM con export default)
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// 🧩 1. Verificar que la variable de entorno exista
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error('❌ La variable FIREBASE_SERVICE_ACCOUNT_JSON no está definida en Render.');
}

// 🧠 2. Parsear el JSON de las credenciales
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// 🔧 3. Normalizar saltos de línea del private_key (Render a veces los pasa con "\\n")
if (typeof serviceAccount.private_key === 'string') {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

// 🚀 4. Inicializar Firebase solo si no hay una app existente
const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount),
    });

// 🧱 5. Exponer las funcionalidades que usarás (Auth, Firestore, Storage, etc.)
const admin = {
  auth: () => getAuth(app),
};

export default admin;
