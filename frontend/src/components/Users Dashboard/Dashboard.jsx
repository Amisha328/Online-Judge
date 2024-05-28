import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [name, setName] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      // console.log(cookies.token);
      // if (!cookies.token) {
      //   navigate("/login");
      //   return;
      // }
      try {
        const { data } = await axios.post("http://localhost:5000/verify-token", {}, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const { status, user } = data;
        if (status) {
          setName(user);
          toast(`Hello, ${user}!`, { position: "top-right" });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Verification error:", error);
        // removeCookie("token");
        navigate("/login");
      }
    };
    verifyCookie();
  }, []);

  const Logout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <>
     <nav
                      className="navbar navbar-expand-lg navbar-dark bg-dark"
                    >
                      <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
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
                              <Link className="nav-link active" to="/">Compete</Link>
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
      <div className="home_page">
        <h4>Welcome <span>{name}</span></h4>
        {/* <button onClick={Logout}>LOGOUT</button> */}
      </div>
      <ToastContainer />
    </>
  );
}
