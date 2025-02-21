import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPassword } from "../../config/firebase";

const Login = () => {
  const [formName, setFormName] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (formName === "Sign Up") {
      signup(username, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" />
      <form
        onSubmit={onSubmitHandler}
        action="login-form"
        className="login-form"
      >
        <h2>{formName}</h2>
        {formName === "Sign Up" && (
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
        )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email address"
          className="form-input"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          className="form-input"
        />
        <button type="submit">
          {formName === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-forgot">
          {formName === "Sign Up" ? (
            <p className="login-toggle">
              Already have an account ?
              <span onClick={() => setFormName("Login")}>Login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Don't have an account?
              <span onClick={() => setFormName("Sign Up")}>Create account</span>
            </p>
          )}

          {formName === "Login" ? (
            <p className="login-toggle">
              Forgot password?
              <span onClick={() => resetPassword(email)}>Reset Password</span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
