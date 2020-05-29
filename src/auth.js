import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import React from "react";
import defaultUserImage from "./images/default-user-image.jpg";
import { CREATE_USER } from "./graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: "AIzaSyAaTl_jRyivchaSJgbGVQhlF7t9j2RwOnw",
  authDomain: "instagram-lane.firebaseapp.com",
  databaseURL: "https://instagram-lane.firebaseio.com",
  projectId: "instagram-lane",
  storageBucket: "instagram-lane.appspot.com",
  messagingSenderId: "465010567115",
  appId: "1:465010567115:web:fc0c10f025381cd35ef84e",
  measurementId: "G-LJ5KWG90WQ",
});

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = React.useState({ status: "loading" });
  const [createUser] = useMutation(CREATE_USER);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref(`metadata/${user.uid}/refreshTime`);

          metadataRef.on("value", async (data) => {
            if (!data.exists) return;
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  async function signInWithGoogle() {
    await firebase.auth().signInWithPopup(provider);
  }

  async function signUpWithEmailAndPassword(formData) {
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(formData.email, formData.password);
    if (data.additionalUserInfo.isNewUser) {
      const variables = {
        userId: data.user.uid,
        name: formData.name,
        username: formData.username,
        email: data.user.email,
        bio: "",
        website: "",
        profileImage: "",
        phoneNumber: defaultUserImage,
      };

      await createUser({ variables });
    }
  }

  async function signOut() {
    setAuthState({ status: "loading" });
    await firebase.auth().signOut();
    setAuthState({ status: "out" });
  }

  if (authState.status === "loading") {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
          authState,
          signInWithGoogle,
          signOut,
          signUpWithEmailAndPassword,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
