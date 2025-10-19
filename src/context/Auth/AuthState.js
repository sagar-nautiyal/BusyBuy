import { app } from "../../config/firebase";
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signup = async (email, password) => {
    try {
      const userCrendetials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCrendetials;
    } catch (err) {
      throw err;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCrendetials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCrendetials;
    } catch (err) {
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      throw err;
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, setLoading, signup, signIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
