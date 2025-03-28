import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmJyVXHluhMNW9c5CAbeAX7mK7KU4D-CE",
  authDomain: "picmagic-art.firebaseapp.com",
  projectId: "picmagic-art",
  storageBucket: "picmagic-art.firebasestorage.app",
  messagingSenderId: "480971365028",
  appId: "1:480971365028:web:99be0f06c7fd3d93e4a431"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function signIn(){
    try{
        await signInWithPopup(auth, new GoogleAuthProvider())
    }catch(err){
        alert("Error logging in!")
        console.log(err)
    }
}

async function  signupWithEmailPwd(email, pwd) {
    try{
        await createUserWithEmailAndPassword(auth, email, pwd)
    }catch(err){
        alert("Error logging in!")
        console.log(err)
    }
    
}

async function  loginWithEmailPwd(email, pwd) {
    try{
        await signInWithEmailAndPassword(auth, email, pwd)
    }catch(err){
        alert("Error logging in!")
        console.log(err)
    }
    
}

export {
    auth,
    signIn,
    signupWithEmailPwd,
    loginWithEmailPwd
}