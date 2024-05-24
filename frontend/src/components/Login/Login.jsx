import React from "react";
import "./Login.css";
import { useState } from "react";
import { FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Login() {
  let navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [messages, setMessages] = useState({
    email: "",
    password: "",
    server:""
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  function validateEmail(email){
          if (!email) {
            setMessages({
              ...messages,
              email: "Email address is required",
            });
          }
        
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/; 
        
          if (!emailRegex.test(email)) {
            setMessages({
              ...messages,
              email: "Please enter a valid email address",
            });
          }
          else {
            setMessages({
              ...messages,
              email: "",
            });
          }
        }
        function validatePassword(password){
          // console.log("PasswordValidation "+password);
          // console.log("Password length: "+ password.toString().length);
          
          if(password.toString().length < 8 || password.toString().length > 12) {
            setMessages({
              ...messages,
              password: "It is a required field and length should be between 8 and 12 characters",
            });
          }
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/;
          if(!passwordRegex.test(password)){
            setMessages({
              ...messages,
              password: "Password must contain atleast one uppercase,one lowercase, one digit, and one special character",
            });
          }
          else {
            setMessages({
              ...messages,
              password: "",
            });
          }
        }

        const handleOnBlur = (event) => {
          if (event.target) {
            console.log(event);
            switch (event.target.name) {
              case "email":
                setTouched({ ...touched, email: true });
                validateEmail(user.email);
                break;
              case "password":
                setTouched({ ...touched, password: true });
                validatePassword(user.password);
                break;
              default:
                break;
            }
          }
        }

        const handleChange = (event) => {
          if (event?.target) {
           // console.log(event);
            switch (event.target.name) {
              case "email":
                if (touched.email){
                  validateEmail(event.target.value);
                }
                break;
              case "password":
                if (touched.password){
                  validatePassword(event.target.value);
                }
                break;
              default:
                break;
            }
            
            setUser({ ...user, [event.target.name]: event.target.value});
          }
        }

        const disableButton = () => {
          if(user.email === "" || user.password === "") return true;
          if(messages.email !== "" || messages.password !== "") return true;
          return false;
        }
    
        
        const handleLogin = async (event) => {
          event.preventDefault();
          console.log(
            `Email: ${user.email} Password: ${user.password}`
          );

          try {
            const response = await fetch("http://localhost:5000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user),
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Something went wrong!");
            }
      
            const data = await response.json();
            console.log(data);
            navigate("/dashboard");
          } catch (error) {
            console.log('There was an error logging in the user!', error);
            setMessages({ ...messages, server: error.message });
          }

          try {
            const response = await axios.post("http://localhost:5000/login", user, {
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            console.log(response.data);
            navigate("/dashboard");
          } catch (error) {
            if (error.response && error.response.data) {
              setMessages({ ...messages, server: error.response.data.message });
            } else {
              setMessages({ ...messages, server: "An error occurred. Please try again." });
            }
            console.log('There was an error logging in the user!', error);
          }
        };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
           <a className="navbar-brand" href="/">
            O<i>nline</i> J<i>udge</i>
          </a>
      </div>
      </nav>
      <div className="form-container container-fluid d-flex align-items-center justify-content-center vh-100">
        <div className="card">
          <form>
            <h2 className="title">Login</h2>
            <div className="input-container">
              <label>Email id:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                  onChange={handleChange}
                  onBlur={handleOnBlur}
              />
              {messages.email && (
                <div className="error-prompt">{messages.email}</div>
              )}
            </div>
            <div className="input-container">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={user.password}
                  onChange={handleChange}
                  onBlur={handleOnBlur}
              />
              {messages.password && (
                <div className="error-prompt">{messages.password}</div>
              )}
            </div>
            <div className="form-submit-container">
              <button
                type="submit"
                onClick={handleLogin}
                className="login-btn"
                disabled={disableButton()}
              >
                Login
              </button>
              <div className="login-options">
                <div className="signup-link">
                  <Link to="/signup">SignUp</Link>
                  <span>to create a new account</span>
                </div>
                <div className="forgot-password">
                  <a href="/forgot-password">Forgot password?</a>
                </div>
              </div>
              {messages.server && <div className="error-prompt">{messages.server}</div>}
              <div className="or">OR</div>
              <button className="google-btn">
                <FaGoogle className="google-icon"/> Login with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
