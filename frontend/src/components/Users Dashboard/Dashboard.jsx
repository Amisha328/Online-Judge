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
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [problemsSolved, setProblemsSolved] = useState([]);
  const root = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.post(`${root}/verify-token`, {}, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const { status, user, id } = data;
        if (status) {
          setUserId(id);
          setName(user);
          console.log(`user id: ${userId}`);
          console.log(`user name: ${name}`);
          toast(`Hello, ${user}!`, { position: "top-right" });
        } else {
          removeCookie("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Verification error:", error);
        // removeCookie("token");
        navigate("/");
      }
    };
    verifyCookie();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log(userId);
      if (userId) {
        try {
          const response = await axios.get(`${root}/${userId}/profile`);
          console.log(response);
          setUser(response.data.user);
          setProblemsSolved(response.data.problemsSolved);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [userId, root]);

  return (
    <>
     <NavBar/>
      {/* <div className="home_page">
        <h4>Welcome <span>{name}</span></h4>
      </div> */}
      <div className="container mt-5">
        {user ? (
           <div className="card main-profile mb-5">
           <h2 className="text-center">User Profile</h2>
           <div className="card-body profile-card">
             <h5 className="card-title">{user.name}</h5>
             <p className="card-text">Email: {user.email}</p>
             <p className="card-text">Phone: {user.phoneNo}</p>
           </div>
         </div>
        ) : (
          <div>Loading...</div>
        )}
        <h3>Problems Solved</h3>
        {problemsSolved.length === 0 ? (
          <div>No problems solved yet.</div>
        ) : (
          <table className="table table-striped mt-3">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Solved At</th>
              </tr>
            </thead>
            <tbody>
              {problemsSolved.map((problem, index) => (
                <tr key={index}>
                  <td>{problem.problemDetails.title}</td>
                  <td>{problem.problemDetails.difficulty}</td>
                  <td>{new Date(problem.submissionTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
