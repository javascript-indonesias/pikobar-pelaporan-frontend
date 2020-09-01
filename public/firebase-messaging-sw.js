// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js')
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID // 4の messagingSenderId をコピペ
})

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging()