// firebase.js  (ESM con export default)
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON no está definida');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
if (serviceAccount.private_key?.includes('\\n')) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

const app = getApps().length
  ? getApp()
  : initializeApp({ credential: cert(serviceAccount) });

// exponemos un objeto estilo "admin" con lo que tus rutas usan:
// - auth: para crear usuarios, etc.
const admin = {
  auth: () => getAuth(app),
};

// 👇 ESTE ES EL PUNTO CLAVE
export default admin;
