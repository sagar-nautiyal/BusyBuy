import React, { useRef, useContext, useEffect } from "react";
import styles from "./LoginPage.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";
import { toast } from "react-toastify";
const LoginPage = () => {
  const { loading, setLoading, signIn, user } = useContext(AuthContext);

  const emailInput = useRef();
  const passwordInput = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
    if (user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    if (!email || password.length < 6) {
      return toast.error("Please enter valid credentials");
    }

    try {
      setLoading(true);

      await signIn(email, password);
      toast.success("User Logged In Succesfulyy!");
    } catch (err) {
      console.log(err.message);
      toast.error("Please enter Correct Credentials");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSignIn}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          ref={emailInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          ref={passwordInput}
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign In"}
        </button>
        <NavLink
          to="/signup"
          style={{
            textDecoration: "none",
            color: "#224957",
            fontFamily: "Quicksand",
          }}
        >
          <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
        </NavLink>
      </form>
    </div>
  );
};

export default LoginPage;
