import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCz5heuisn9LROtRpl0dTGX8iDwaaBRC_E",
  authDomain: "test-e93e5.firebaseapp.com",
  projectId: "test-e93e5",
  storageBucket: "test-e93e5.firebasestorage.app",
  messagingSenderId: "208770780932",
  appId: "1:208770780932:web:b7fc80ebade56c153e4a51",
  measurementId: "G-7BCY8BMVKE"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseMessaging = firebaseApp.messaging();

export async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker 등록 성공:", registration);
  } catch (error) {
    console.log("Service Worker 등록 실패:", error);
  }    
}

export function firebaseReqPermission(setFcmToken, setAlarm) {
  firebaseMessaging
  .requestPermission()
  .then(() => {
    return firebaseMessaging.getToken({ vapidKey: 'BJBcC7PSeHvnJSg537HVdvYNL2LDb-TJZKIaLROzL_6WIx4z1WsIYd_Q6nLNVlyQvUQunYPYABXy7BRmJGIo4ek' }); //등록 토큰 받기
  })
  .then(function (token) {
    console.log(token)
    setFcmToken(token);
  })
  .catch(function (error) {
    console.log("FCM Error : ", error);
  });

  firebaseMessaging.onMessage((payload) => {
    console.log(payload)
    setAlarm({num:+payload.data.num, title:payload.data.title, body:payload.data.body})
  });  
}