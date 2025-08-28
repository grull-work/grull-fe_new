import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

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
    prompt : "select_account"
});

export const auth = getAuth(firebaseApp);

// Function to handle popup sign-in with fallback to redirect
export const signInWithGooglePopup = async () => {
  try {
    // Try popup first
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.log("Popup failed, trying redirect:", error);
    
    // If popup fails due to COOP policy, fall back to redirect
    if (error.code === 'auth/popup-blocked' || error.message.includes('Cross-Origin-Opener-Policy')) {
      await signInWithRedirect(auth, provider);
      // The redirect will happen, and the result will be handled when the page loads
      throw new Error('Redirect initiated');
    }
    throw error;
  }
};

// Function to get redirect result (call this when page loads)
export const getGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error("Error getting redirect result:", error);
    throw error;
  }
};