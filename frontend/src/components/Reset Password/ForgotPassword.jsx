import React, { useState } from "react";
import axios from "axios";
import './ForgotPassword.css'
import { ToastContainer, toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const root = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${root}/request-password-reset`, { email });
      toast(`${response.data}`, { position: "top-right" });
      console.log(response);
      // setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending password reset email");
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
        <div className="card card-style">
          <form>
                    <h2 className="title">Forgot Password</h2> 
                    <div className="input-container">
                    <label>Enter your email:</label>
                    <input
                              type="email"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className = "button-container">
                    <button className="auth-button" type="submit" onClick={handleSubmit}>Send ➡️</button>
                    </div>
                    
                    {message && <div className="error-prompt">{message}</div>}
                    
      </form>
      </div>
      </div>
      <ToastContainer />
    </>
  );
}
