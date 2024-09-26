import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CompetitionPage.css';
import NavBar from '../NavBar/NavBar';
import { ToastContainer, toast } from "react-toastify";

const CompetitionPage = () => {
  let navigate = useNavigate();
  const [currentContests, setCurrentContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
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
        // console.log(data);
        setIsAdmin(data.isAdmin);

      } catch (error) {
        console.error("Verification error:", error);
        navigate("/login");
      }
    };
    verifyCookie();
  }, []);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const current = await axios.get(`${root}/current`);
        const upcoming = await axios.get(`${root}/upcoming`);
        const past = await axios.get(`${root}/past`);
        setCurrentContests(current.data);
        setUpcomingContests(upcoming.data);
        setPastContests(past.data);
      } catch (err) {
        console.error('Error fetching contests:', err);
      }
    };
    fetchContests();
  }, []);

  const handleCompeteClick = (contest) => {
    navigate(`/competitions/${contest._id}/problems`,{ state: { startDateTime: contest.start_date_time, endDateTime: contest.end_date_time } });
  };

  const handleHost = () => {
    navigate("/host-contest");
  }

  const handleCancelContest = async (contestId) => {
    if (!window.confirm("Are you sure you want to cancel this contest?")) return;
  
    try {
      await axios.delete(`${root}/cancel-contest/${contestId}`, {
        withCredentials: true,
      });
      toast("Contest canceled successfully", { position: "top-right" });
  
      // Refresh the upcoming contests list
      const updatedContests = upcomingContests.filter(contest => contest._id !== contestId);
      setUpcomingContests(updatedContests);
    } catch (error) {
      toast("Failed to cancel contest", { position: "top-right" });
      console.error('Error canceling contest:', error);
    }
  };  

  return (
    <>
    <NavBar/>
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
      <h1>Competitions</h1>
      {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={handleHost}>Host Contest</button>
      )}
      </div>
      <div className="competitions-section">
        <h2>Current Competitions</h2>
        {currentContests.length === 0 ? (
          <p>No current competitions.</p>
        ) : (
          currentContests.map((contest) => (
            <div key={contest._id} className="contest-card">
              <h3>{contest.title}</h3>
              <p>{new Date(contest.start_date_time).toLocaleString()} - {new Date(contest.end_date_time).toLocaleString()}</p>
              <button className = "btn btn-success btn-sm" onClick={() => handleCompeteClick(contest)}>Let's Compete</button>
            </div>
          ))
        )}
      </div>
      <div className="competitions-section">
        <h2>Upcoming Competitions</h2>
        {upcomingContests.length === 0 ? (
          <p>No upcoming competitions.</p>
        ) : (
          upcomingContests.map((contest) => (
            <div key={contest._id} className="contest-card">
              <h3>{contest.title}</h3>
              <p>{new Date(contest.start_date_time).toLocaleString()} - {new Date(contest.end_date_time).toLocaleString()}</p>
              <button className = "btn-sm me-2" disabled>Not Started</button>
              {isAdmin && (
                <button className="btn btn-danger btn-sm" onClick={() => handleCancelContest(contest._id)}>Cancel Contest</button>
              )}
            </div>
          ))
        )}
      </div>
      <div className="competitions-section">
        <h2>Past Competitions</h2>
        {pastContests.length === 0 ? (
          <p>No past competitions in the last 10 days.</p>
        ) : (
          pastContests.map((contest) => (
            <div key={contest._id} className="contest-card">
              <h3>{contest.title}</h3>
              <p>{new Date(contest.start_date_time).toLocaleString()} - {new Date(contest.end_date_time).toLocaleString()}</p>
              <button className = "btn btn-success btn-sm" onClick={() => handleCompeteClick(contest)}>View</button>
            </div>
          ))
        )}
      </div>
    </div>
    <ToastContainer />
    </>
  );
};

export default CompetitionPage;
