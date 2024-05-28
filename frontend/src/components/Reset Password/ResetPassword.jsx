import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/reset-password/${id}/${token}`, {password});
      toast(`${response.data}`, { position: "top-right" });
      // navigate("/login");
      setPassword("");
    } catch (error) {
      setMessage("Error resetting password");
    }
  };

  return (
    <>
     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
           <a className="navbar-brand" href="/">
            O<i>nline</i> J<i>udge</i>
          </a>
          <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
              <ul className="navbar-nav me-3 mb-2 mb-lg-0">
                  <li className="nav-item">
                      <Link className="nav-link active" aria-current="page" to="/signup">
                        SignUp
                      </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/login">Login</Link>
                  </li>
              </ul>
        </div> 
      </div>
      </nav>
      <div className="form-container container-fluid d-flex align-items-center justify-content-center vh-100">
        <div className="card card-style">
        <form>
                    <h2 className="title">Reset Password</h2> 
                    <div className="input-container">
                              <label>Enter new password:</label>
                              <input
                                        type="password"
                                        name = "password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                              />
                    </div>
                    <div className = "button-container">
                              <button className="auth-button" type="submit" onClick={handleSubmit}>Update ➡️</button>
                    </div>
                    
      </form>
      {message && <p>{message}</p>}
      </div>
      </div>
      <ToastContainer />
    </>
  );
}
