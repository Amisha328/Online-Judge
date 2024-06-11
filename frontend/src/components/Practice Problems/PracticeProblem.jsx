import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PracticeProblem.css';
import NavBar from '../NavBar/NavBar';

const PracticeProblem = () => {
  let navigate = useNavigate();
  const root = import.meta.env.VITE_BACKEND_URL;
  const [problems, setProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [currentProblem, setCurrentProblem] = useState({
    title: '',
    description: '',
    difficulty: '',
    tags: '',
    sampleTestCases: [{ input: '', expectedOutput: '', explanation: '' }]
  });

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.post(`${root}/verify-token`, {}, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log(data);
        setIsAdmin(data.isAdmin);

      } catch (error) {
        console.error("Verification error:", error);
        navigate("/login");
      }
    };
    verifyCookie();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${root}/problems`);
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching the problems:', error);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${root}/problems/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (error) {
      console.error('Error deleting the problem:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/problems/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/problems/create");
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = difficultyFilter ? problem.difficulty === difficultyFilter : true;
    const matchesTag = tagFilter ? problem.tags.includes(tagFilter) : true;
    return matchesDifficulty && matchesTag;
  });

  return (
   <>
   <NavBar/>
   <div className="container mt-5">
        <div className="d-flex justify-content-between mb-4">
          <h1>Practice Problems</h1>
          {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>+ Create New Problem</button>
          )}
        </div>
        <div className="filters mb-4 d-flex align-items-center">
          <select
            className="form-select me-3 custom-select"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            className="form-select custom-select"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="">All Tags</option>
            <option value="Array">Array</option>
            <option value="Trees">Trees</option>
            <option value="String">String</option>
            <option value="Graph">Graph</option>
            <option value="DP">DP</option>
            <option value="Hashing">Hashing</option>
            <option value="Linked List">Linked List</option>
            <option value="Math">Math</option>
            <option value="Sliding Window">Sliding Window</option>
            <option value="Binary Search">Binary Search</option>
          </select>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Difficulty</th>
              <th>Tags</th>
              {isAdmin && (  
              <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map(problem => (
              <tr key={problem._id} className="problem-row">
                <td>
                  <Link to={`/problems/${problem._id}`} className="problem-link">
                    {problem.title}
                  </Link>
                </td>
                <td>{problem.difficulty}</td>
                <td>{problem.tags.split(',').map(tag => tag.trim()).join(', ')}</td>
                {isAdmin && (  
                <td>
                  <button className="btn btn-secondary me-2" onClick={() => handleEdit(problem._id)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(problem._id)}>Delete</button>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   </>
  );
}

export default PracticeProblem;
