import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function NavBar() {
  let navigate = useNavigate();

  const Logout = async () => {
        try {
          await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
          navigate("/login");
        } catch (error) {
          console.error("Failed to logout:", error);
        }
  };
          return (
                    <nav
                      className="navbar navbar-expand-lg navbar-dark bg-dark"
                    >
                      <div className="container-fluid">
                        <Link className="navbar-brand" to="/dashboard">
                        O<i>nline</i> J<i>udge</i>
                        </Link>
                        <button
                          className="navbar-toggler"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#navbarSupportedContent"
                          aria-controls="navbarSupportedContent"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
                          <ul className="navbar-nav me-3 mb-2 mb-lg-0">
                            <li className="nav-item">
                              <Link className="nav-link active" aria-current="page" to="/dashboard">
                                Dashboard
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link active" to="/compete">Compete</Link>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link active" to="/problems">Practice</Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link active" to="/login" onClick={Logout}>Logout</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>
          )
}
