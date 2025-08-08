import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAprhBCuYRH25Omr5f0EmsAHdy_uksh1s",
  authDomain: "grull-302b6.firebaseapp.com",
  projectId: "grull-302b6",
  storageBucket: "grull-302b6.appspot.com",
  messagingSenderId: "307347345397",
  appId: "1:307347345397:web:cb66b8601e1aef80bc9abc"
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth(firebaseApp);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);