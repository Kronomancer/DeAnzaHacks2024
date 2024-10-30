import React, { useState, useEffect } from "react";
import "../Styling/Login.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { auth, db } from "../Components/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function Login() {
  const [hidePassword, setHidePassword] = useState(true);
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/lobby");
    }
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values) => {
    const { username, password } = values;
    setFirebaseError("");

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const email = userDoc.data().email;

        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/lobby");
      } else {
        setFirebaseError("Username not found");
      }
    } catch (error) {
      setFirebaseError(error.message);
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="back-arrow" onClick={() => navigate("/start")}>
          <FaArrowLeft />
        </div>
        <h2>LOGIN</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form>
              <label htmlFor="username">Username</label>
              <Field 
                type="text" 
                id="username" 
                name="username" 
                className={touched.username && errors.username ? "input-error" : ""}
              />
              <ErrorMessage name="username" component="p" className="error-message" />

              <label htmlFor="password">Password</label>
              <div className="password-container">
                <Field
                  type={hidePassword ? "password" : "text"}
                  id="password"
                  name="password"
                  className={touched.password && errors.password ? "input-error" : ""}
                />
                <span
                  className="toggle-password-visibility"
                  onClick={() => setHidePassword(!hidePassword)}
                >
                  {hidePassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage name="password" component="p" className="error-message" />

              {firebaseError && <p className="error-message">{firebaseError}</p>}

              <button type="submit">SIGN IN</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
