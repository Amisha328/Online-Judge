import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Dashboard.css';
import NavBar from '../NavBar/NavBar';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaEdit } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [practiceProblemsSolved, setPracticeProblemsSolved] = useState(0);
  const [contestProblemsSolved, setContestProblemsSolved] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5;
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhoneNo, setEditedPhoneNo] = useState("");
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
          // console.log(user);
          setEditedEmail(response.data.user.email); 
          setEditedPhoneNo(response.data.user.phoneNo); 
          setPracticeProblemsSolved(response.data.countProblemsSolved);
          setContestProblemsSolved(response.data.competitionProblemsSolved);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    const fetchTotalProblems = async () => {
      try {
        const response = await axios.get(`${root}/problems-count`);
        setTotalProblems(response.data.count);
      } catch (error) {
        console.error('Error fetching total problems count:', error);
      }
    };

    fetchUserProfile();
    fetchTotalProblems();
  }, [userId, root]);

  const handleSave = async () => {
    
    try {
      const response = await axios.patch(`${root}/${userId}/update-profile`, {
        email: editedEmail,
        phoneNo: editedPhoneNo
      });
      console.log(response);

      if (response.data.status) {
        // Update the user state with the new data
        setUser((prevUser) => ({
          ...prevUser,
          email: editedEmail,
          phoneNo: editedPhoneNo,
        }));
      }
  
      setIsEditing(false);
      toast('Profile updated successfully!', { type: 'success', position: 'top-right' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast('Failed to update profile.', { type: 'error', position: 'top-right' });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedEmail(user.email); // Reset to original values
    setEditedPhoneNo(user.phoneNo); // Reset to original values
  };

  // Calculate pagination for contest problems
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentContestProblemsSolved = contestProblemsSolved.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(contestProblemsSolved.length / problemsPerPage);

  // Data for the pie chart
  const pieData = {
    labels: ['Practice Problems Solved', 'Unsolved Problems'],
    datasets: [
      {
        data: [practiceProblemsSolved, totalProblems - practiceProblemsSolved],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <>
      <NavBar />
      <div className="container dashboard-container">
        <div className="welcome-message">
          <h1>Happy to see you, {name} :D</h1>
        </div>
        </div>
      <div className="container mt-5 d-flex flex-column align-items-center">
        {user ? (
          <div className="card main-profile mb-5">
            <h2 className="text-center mt-3">User Profile</h2>
            <div className="card-body profile-card">
              <h5 className="card-title">{user.name}</h5>
              <p className="card-text">
                <b>Email:</b> {isEditing ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : (
                  user.email
                )}
                <button onClick={handleEditClick} className="btn btn-lg"
                style={{color:"#c52155"}}> 
                  {isEditing ? '' : <FaEdit />}
                </button>
              </p>
              <p className="card-text">
                <b>Phone:</b> {isEditing ? (
                  <input
                    type="text"
                    value={editedPhoneNo}
                    onChange={(e) => setEditedPhoneNo(e.target.value)}
                  />
                ) : (
                  user.phoneNo
                )}
                <button onClick={handleEditClick} className="btn btn-lg"
                 style={{color:"#c52155"}}>
                  {isEditing ? '' : <FaEdit />}
                </button>
              </p>
              {isEditing && (
                <div>
                  <button onClick={handleSave} className="btn btn-success mt-2 me-2">Save</button>
                  <button onClick={handleCancelClick} className="btn btn-secondary mt-2">Cancel</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}

        <div className="mb-5">
          <h2 className="text-center"><b>Practice Problems Solved</b></h2>
          <div className="container-pie-data">
            <Pie data={pieData} />
          </div>
          <div className="problems-solved">
            <span>{practiceProblemsSolved}</span> / <span>{totalProblems}</span> Problems Solved
          </div>
        </div>

        <h2 className="text-center mb-3"><b>Contest Problems Solved</b></h2>
        {contestProblemsSolved.length === 0 ? (
          <div>No contest problems solved yet.</div>
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
                {currentContestProblemsSolved.map((problem, index) => (
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
