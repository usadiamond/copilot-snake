// Minimal client logic to create/join a session and send inputs.
// Integrate onState callback into your game loop and call sendInput when player acts.
import {
  anonSignIn,
  push,
  set,
  onValue,
  gameSessionRef,
  sessionsListRef,
  ref,
  db,
} from "./firebaseClient.js";

// Create a new session with optional initialState
export async function createSession(initialState = {}) {
  await anonSignIn();
  const sessionsRef = sessionsListRef();
  const newSessRef = push(sessionsRef);
  const sessionId = newSessRef.key;
  await set(gameSessionRef(sessionId), {
    createdAt: Date.now(),
    state: initialState,
    players: {},
  });
  return sessionId;
}

// Join a session and start listening to changes
export async function joinSession(sessionId, playerInfo) {
  await anonSignIn();
  const playerRef = ref(db, `sessions/${sessionId}/players/${playerInfo.id}`);
  await set(playerRef, { ...playerInfo, joinedAt: Date.now() });
  const sessionRef = gameSessionRef(sessionId);
  const unsubscribe = (cb) => {
    return onValue(sessionRef, (snap) => cb(snap.val()));
  };
  return {
    onState: (cb) => unsubscribe(cb),
    leave: async () => {
      await set(playerRef, null);
    },
    sessionRef,
  };
}

// Append a player input to inputs list for server processing
export async function sendInput(sessionId, playerId, input) {
  const inputsRef = ref(db, `sessions/${sessionId}/inputs`);
  const itemRef = push(inputsRef);
  await set(itemRef, {
    playerId,
    input,
    at: Date.now(),
  });
}