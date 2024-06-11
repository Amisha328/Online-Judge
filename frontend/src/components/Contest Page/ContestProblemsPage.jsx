import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import './ContestProblemsPage.css';

const ContestProblemsPage = () => {
  const location = useLocation();
  const { contestId } = useParams();
  // console.log(contestId);
  const { startDateTime, endDateTime } = location.state;
  const [problems, setProblems] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const root = import.meta.env.VITE_BACKEND_URL;
 
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${root}/contests/${contestId}`);
        const problemIds = response.data;
        console.log(problemIds);

        // Fetch details for each problem ID
        const problemPromises = problemIds.map((problemId) =>
          axios.get(`${root}/problems/${problemId}`)
        );

        // Wait for all problem details to be fetched
        const problemsDetails = await Promise.all(problemPromises);
        const problemsData = problemsDetails.map((res) => res.data);
        setProblems(problemsData);
      } catch (err) {
        console.error('Error fetching problems:', err);
      }
    };
    fetchProblems();
  }, [contestId]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDateTime);
      const now = new Date();
      const difference = end - now;
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = null;
      }

      return timeLeft;
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(`${newTimeLeft.hours}h ${newTimeLeft.minutes}m ${newTimeLeft.seconds}s`);
      } else {
        setTimeLeft("Contest has ended");
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [endDateTime]);

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h1>Problems</h1>
        <div className="timer">
          <h3>Time Left: {timeLeft}</h3>
        </div>
        {problems.length === 0 ? (
          <p>No problems found for this contest.</p>
        ) : (
          problems.map((problem) => (
            <div key={problem._id} className="problem-card">
              <h3>{problem.title}</h3>
              <div className="btn-container">
                <Link to={`${problem._id}`} className="btn btn-primary">Solve Problem</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ContestProblemsPage;
