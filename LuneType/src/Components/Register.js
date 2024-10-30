import React, { useState } from "react";
import "../Styling/Register.css";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"; // Import the arrow icon
import { auth, db } from "../Components/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Register() {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const handleRegister = async (values) => {
    try {
      setFirebaseError("");

      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: values.username,
        email: values.email,
        created: Timestamp.now(),
      });

      alert("Registration successful!");
    } catch (error) {
      setFirebaseError(error.message);
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="back-arrow" onClick={() => navigate("/start")}>
          <FaArrowLeft />
        </div>
        <h2>REGISTER</h2>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
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

              <label htmlFor="email">Email</label>
              <Field 
                type="email" 
                id="email" 
                name="email" 
                className={touched.email && errors.email ? "input-error" : ""}
              />
              <ErrorMessage name="email" component="p" className="error-message" />

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

              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-container">
                <Field
                  type={hideConfirmPassword ? "password" : "text"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}
                />
                <span
                  className="toggle-password-visibility"
                  onClick={() => setHideConfirmPassword(!hideConfirmPassword)}
                >
                  {hideConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage name="confirmPassword" component="p" className="error-message" />

              {firebaseError && <p className="error-message">{firebaseError}</p>}

              <button type="submit">SIGN UP</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
