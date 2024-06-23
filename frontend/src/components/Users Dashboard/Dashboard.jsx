import React, { useEffect, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5;
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
          toast(`Hello, ${user}!`, { position: "top-right" });
        } else {
          removeCookie("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Verification error:", error);
        navigate("/");
      }
    };
    verifyCookie();
  }, [navigate, root, removeCookie]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${root}/${userId}/profile`);
          setUser(response.data.user);
          setProblemsSolved(response.data.problemsSolved);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [userId, root]);

  // Calculate pagination
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblemsSolved = problemsSolved.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(problemsSolved.length / problemsPerPage);

  return (
    <>
      <NavBar/>
      <div className="container mt-5 d-flex flex-column align-items-center">
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
        <h2 className="text-center mb-3"><b>Contest Problems Solved</b></h2>
        {problemsSolved.length === 0 ? (
          <div>No problems solved yet.</div>
        ) : (
          <>
            <table className="table table-striped thead-wrapper mt-3">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Tags</th>
                  <th scope="col">Solved At</th>
                </tr>
              </thead>
              <tbody>
                {currentProblemsSolved.map((problem, index) => (
                  <tr key={index}>
                    <td>{problem.problemDetails.title}</td>
                    <td>{problem.problemDetails.difficulty}</td>
                    <td>{problem.problemDetails.tags}</td>
                    <td>{new Date(problem.submissionTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-10">
              <button
                className="btn btn-secondary mx-5"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div>Page {currentPage} of {totalPages}</div>
              <button
                className="btn btn-secondary mx-5"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
