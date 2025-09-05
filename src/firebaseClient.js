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
  apiKey: "AIzaSyDjcooViPoRmt0mSI65_s7GnIEorPEfcZI",
  authDomain: "fir-snake-38abc.firebaseapp.com",
  projectId: "fir-snake-38abc",
  storageBucket: "fir-snake-38abc.firebasestorage.app",
  messagingSenderId: "437612710721",
  appId: "1:437612710721:web:450362c4b10f937917efc0"
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
