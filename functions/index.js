// Firebase Cloud Functions (Node 18 / CommonJS)
// Simple matchmaking and input-processing example
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.database();

exports.matchmake = functions.https.onCall(async (data, context) => {
  const maxPlayers = data.maxPlayers || 2;
  const playerInfo = data.player || { id: context.auth?.uid || "anon", name: "player" };

  const sessionsSnap = await db.ref("sessions").orderByChild("createdAt").limitToFirst(50).once("value");
  let chosenId = null;
  sessionsSnap.forEach((snap) => {
    const val = snap.val();
    const players = val.players ? Object.keys(val.players).length : 0;
    if (players < maxPlayers) {
      chosenId = snap.key;
      return true;
    }
  });

  if (!chosenId) {
    const newRef = db.ref("sessions").push();
    chosenId = newRef.key;
    await newRef.set({
      createdAt: Date.now(),
      state: {
        tick: 0,
        snakes: {},
      },
      players: {},
    });
  }

  const playerRef = db.ref(`sessions/${chosenId}/players/${playerInfo.id}`);
  await playerRef.set({ ...playerInfo, joinedAt: Date.now() });

  return { sessionId: chosenId };
});

exports.applyInputs = functions.database.ref("/sessions/{sessionId}/inputs/{inputId}")
  .onCreate(async (snap, context) => {
    const input = snap.val();
    const sessionId = context.params.sessionId;
    const stateRef = db.ref(`sessions/${sessionId}/state`);
    const stateSnap = await stateRef.once("value");
    const state = stateSnap.val() || { tick: 0, snakes: {} };

    if (input && input.input && input.input.type === "move") {
      const pid = input.playerId;
      if (!state.snakes[pid]) {
        state.snakes[pid] = { x: 10, y: 10 };
      }
      const s = state.snakes[pid];
      const dir = input.input.dir;
      if (dir === "up") s.y -= 1;
      if (dir === "down") s.y += 1;
      if (dir === "left") s.x -= 1;
      if (dir === "right") s.x += 1;
      state.tick = (state.tick || 0) + 1;

      await stateRef.set(state);
    }
    return null;
  });
