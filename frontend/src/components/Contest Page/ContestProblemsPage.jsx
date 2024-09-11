import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import './ContestProblemsPage.css';

const ContestProblemsPage = () => {
  const location = useLocation();
  const { contestId } = useParams();
  const { startDateTime, endDateTime } = location.state;
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [contestEnded, setContestEnded] = useState(false);
  let navigate = useNavigate();
  const root = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${root}/contests/${contestId}`);
        const problemIds = response.data;
        const problemPromises = problemIds.map((problemId) =>
          axios.get(`${root}/problems/${problemId}`)
        );
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
        setContestEnded(true);
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [endDateTime]);

  useEffect(() => {
    if (contestEnded) {
      const fetchLeaderboard = async () => {
        try {
          // console.log(contestId);
          const response = await axios.get(`${root}/competitions/${contestId}/leaderboard`);
          // console.log(response.data);
          setLeaderboard(response.data);
        } catch (err) {
          console.error('Error fetching leaderboard:', err);
        }
      };
      fetchLeaderboard();
    }
  }, [contestEnded, contestId]);

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        {contestEnded ? (
          <div>
            <h1>Leaderboard</h1>
            {contestEnded && leaderboard.length === 0 ? (
              <p>Loading leaderboard...</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Problems Solved</th>
                    <th>Language</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.user_id._id}>
                      <td>{index + 1}</td>
                      <td>{entry.name}</td>
                      <td>{entry.problems_solved}</td>
                      <td>{entry.language}</td>
                      <td>{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div>
            <h1>Problems</h1>
            <div className="timer">
              <h3>Time Left: {timeLeft}</h3>
            </div>
            {problems.length === 0 ? (
              <p>No problems found for this contest.</p>
            ) : (
              problems.map((problem) => (
                problem && (
                  <div key={problem._id} className="problem-card">
                    <h4>{problem.title}</h4>
                    <div className="btn-container">
                      <Link 
                        to={`${problem._id}`}
                        state={{ contestId }} // Pass contestId in state
                        className="btn btn-primary"
                      >
                        Solve Problem
                      </Link>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ContestProblemsPage;
