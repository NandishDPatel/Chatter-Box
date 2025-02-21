import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { useContext } from "react";
import { toast } from "react-toastify";
import Toastify from "toastify";
import { AppContext } from "../context/AppContext";


const firebaseConfig = {
  apiKey: "AIzaSyBLvyobLb85z7z9F7_fMDTJuwSmiBYPzTk",
  authDomain: "chatter-box-c8510.firebaseapp.com",
  projectId: "chatter-box-c8510",
  storageBucket: "chatter-box-c8510.firebasestorage.app",
  messagingSenderId: "1070277895563",
  appId: "1:1070277895563:web:61cb22cf46ba1fab7e7b8e",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

//when user create an account two collections users and chats will be created
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Create user profile and empty chats in Firestore
    await Promise.all([
      setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username: username.toLowerCase(),
        email,
        name: "",
        avatar: "",
        bio: "Hey, I'm very excited to use the Chatter Box",
        lastSeen: Date.now(),
      }),
      setDoc(doc(db, "chats", user.uid), {
        chatsData: [],
      })
    ]);

    // Ensure Firebase auth state updates correctly
    console.log("Signup successful. User profile created.");

  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};


const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in!!");
    
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    const { setChatUser, setMessages, setMessagesId } = useContext(AppContext);
    // Clear chat-related states
    setChatUser(null);
    setMessages([]);
    setMessagesId(null);
    
    toast.success("Logged out successfully");
    console.log("Logged out successfully");

  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const resetPassword = async(email) => {
  if(!email){
    toast.error("Email id is required");
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where("email","==",email));
    const querySnap = await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset password link is sent to the mail");
    } else{
      toast.error("Email doesn't exists");
    }
  } catch (error) {
    toast.error(error.message);
    console.log(error);
    
  }
}

export { signup, login, logout, auth, db, resetPassword };
