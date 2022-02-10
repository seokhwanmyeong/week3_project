// Import the functions you need from the SDKs you need
import {initializeApp, getApp} from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"; 
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDGfONonHa7mmMOKctQBHh0q845yYL2Js4",
  authDomain: "project-week3-9a157.firebaseapp.com",
  projectId: "project-week3-9a157",
  storageBucket: "project-week3-9a157.appspot.com",
  messagingSenderId: "1090336368688",
  appId: "1:1090336368688:web:90ffb3b6e441b7e0a065f5",
  // firebase 실시간데이터베이스를 위한 databaseURL 설정
  databaseURL: "https://project-week3-9a157-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firebase의 인스턴스를 상수에 저장
const db = getFirestore(app);
const auth = getAuth()
const apiKey = firebaseConfig.apiKey
const firebaseApp = getApp();
const storage = getStorage(firebaseApp, "gs://project-week3-9a157.appspot.com/");
const realtime = getDatabase(app);

export {db, auth, apiKey, storage, realtime};