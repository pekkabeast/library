const config = {
  apiKey: "AIzaSyC0tsqW2zwxNxOKcuKy3RD3YbCo6fpsQDE",

  authDomain: "library-48577.firebaseapp.com",

  projectId: "library-48577",

  storageBucket: "library-48577.appspot.com",

  messagingSenderId: "77545467553",

  appId: "1:77545467553:web:b5e8eb881b6eaeb00e8ae0",
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return config;
  }
}
