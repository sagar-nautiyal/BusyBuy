import React, { useRef, useEffect, useContext } from "react";
import styles from "./RegisterPage.module.css";
import AuthContext from "../../context/Auth/AuthContext";
import { toast } from "react-toastify";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  // Create your state or ref here to store the value of the input fields
  const { loading, signup, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  // write the submit handler function to validate the forma and signup the user
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const name = nameInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    if (!name) {
      toast.error("Name is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const userCrendetials = await signup(email, password);
      console.log("user Credentials", userCrendetials);

      const user = userCrendetials.user;
      const userId = user.uid;
      const userEmail = user.email;

      if (userCrendetials) {
        const userData = {
          name: name,
          email: userEmail,
          uid: userId,
        };
        const newDoc = await addDoc(collection(db, "users"), userData);

        console.log("New user saved", newDoc.id);
        toast.success("User registered successfully");
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          ref={nameInput}
          className={styles.loginInput}
        />
        <input
          type="email"
          name="email"
          className={styles.loginInput}
          ref={emailInput}
          placeholder="Enter Email"
        />
        <input
          type="password"
          name="password"
          className={styles.loginInput}
          ref={passwordInput}
          placeholder="Enter Password"
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
