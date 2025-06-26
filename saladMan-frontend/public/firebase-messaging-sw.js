// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCz5heuisn9LROtRpl0dTGX8iDwaaBRC_E",
  authDomain: "test-e93e5.firebaseapp.com",
  projectId: "test-e93e5",
  storageBucket: "test-e93e5.firebasestorage.app",
  messagingSenderId: "208770780932",
  appId: "1:208770780932:web:b7fc80ebade56c153e4a51",
  measurementId: "G-7BCY8BMVKE"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) 
    return;

  console.log('Background Message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});