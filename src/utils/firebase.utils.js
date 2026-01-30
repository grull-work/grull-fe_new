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

provider.setCustomParameters({
  prompt: "select_account"
});

export const auth = getAuth(firebaseApp);

// Function to handle popup sign-in with fallback to redirect
export const signInWithGooglePopup = async () => {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.log("Popup failed, error details:", error);

    // Check specifically for popup blocked or closed by user
    if (error.code === 'auth/popup-blocked' || error.message.includes('popup-blocked')) {
      console.warn("Popup was blocked by the browser. Consider falling back to redirect.");
      // You might want to automatically fallback here, or let the component decide
      // For now, we'll throw to let the component know distinctively
      throw error;
    }

    if (error.code === 'auth/popup-closed-by-user') {
      console.warn("User closed the popup before finishing sign in.");
      throw error; // Rethrow so the component can stop the loading state
    }

    // If popup fails due to COOP policy or other environment issues, fall back to redirect
    if (error.message.includes('Cross-Origin-Opener-Policy') || error.code === 'auth/network-request-failed') {
      console.log("COOP policy or network issue detected, falling back to redirect...");
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