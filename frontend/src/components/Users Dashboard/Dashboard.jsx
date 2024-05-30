import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Dashboard.css';
import NavBar from '../NavBar/NavBar';

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
          navigate("/");
        }
      } catch (error) {
        console.error("Verification error:", error);
        // removeCookie("token");
        navigate("/login");
      }
    };
    verifyCookie();
  }, []);


  return (
    <>
     <NavBar/>
      <div className="home_page">
        <h4>Welcome <span>{name}</span></h4>
      </div>
      <ToastContainer />
    </>
  );
}
