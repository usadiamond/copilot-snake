# Deployment notes — Netlify + Firebase (multiplayer scaffold)

1. Create a Firebase project at https://console.firebase.google.com/.
   - Enable Realtime Database.
   - Enable Authentication → Sign-in method → Anonymous (for quick dev).
2. Install Firebase CLI:
   - npm install -g firebase-tools
   - firebase login
   - firebase init (select Functions and Realtime Database; choose Node 18)
3. Copy firebase config (Project settings → SDK config) into src/firebaseClient.js or use Netlify env vars and inject at build time.
4. Deploy functions:
   - cd functions
   - npm install
   - firebase deploy --only functions
5. Deploy the front end:
   - Connect this repo to Netlify and set build command/publish dir (or use netlify.toml).
   - Set any required environment variables in Netlify if you prefer not to commit config.
6. Local testing:
   - Use Firebase emulators: firebase emulators:start --only functions,database
   - Point the client at the emulator when developing.

Security & cost:
- Tighten Realtime Database rules before public release (validate structure, auth).
- Monitor writes: inputs can grow quickly; prune processed inputs and rate-limit clients.
