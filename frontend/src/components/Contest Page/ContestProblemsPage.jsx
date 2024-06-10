import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import './ContestProblemsPage.css';

const ContestProblemsPage = () => {
  const { contestId } = useParams();
  console.log(contestId);
  const [problems, setProblems] = useState([]);

 
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/contests/${contestId}`);
        const problemIds = response.data;
        console.log(problemIds);

        // Fetch details for each problem ID
        const problemPromises = problemIds.map((problemId) =>
          axios.get(`http://localhost:5000/problems/${problemId}`)
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

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h1>Problems</h1>
        {problems.length === 0 ? (
          <p>No problems found for this contest.</p>
        ) : (
          problems.map((problem) => (
            <div key={problem._id} className="problem-card">
              <h3>{problem.title}</h3>
              <div className="btn-container">
                <Link to={`problems/${problem._id}`} className="btn btn-primary">Solve Problem</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ContestProblemsPage;
