// Minimal Firebase v9 modular client initializer for browser
// Replace placeholders with values from Firebase Console -> Project settings -> SDK config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  update,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "%FIREBASE_API_KEY%",
  authDomain: "%FIREBASE_AUTH_DOMAIN%",
  databaseURL: "%FIREBASE_DATABASE_URL%",
  projectId: "%FIREBASE_PROJECT_ID%",
  storageBucket: "%FIREBASE_STORAGE_BUCKET%",
  messagingSenderId: "%FIREBASE_MESSAGING_SENDER_ID%",
  appId: "%FIREBASE_APP_ID%",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

async function anonSignIn() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return auth.currentUser;
}

function gameSessionRef(sessionId) {
  return ref(db, `sessions/${sessionId}`);
}
function sessionsListRef() {
  return ref(db, `sessions`);
}

export {
  db,
  auth,
  anonSignIn,
  ref,
  push,
  onValue,
  set,
  update,
  get,
  child,
  gameSessionRef,
  sessionsListRef,
};