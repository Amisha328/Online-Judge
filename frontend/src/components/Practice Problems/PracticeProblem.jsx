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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 10;

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
        setUserId(data.id);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Verification error:", error);
        navigate("/login");
      }
    };
    verifyCookie();
  }, [navigate, root]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${root}/problems`, {
            params: { userId },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          console.log('Problems fetched:', response.data);
          setProblems(response.data);
        }
      } catch (error) {
        console.error('Error fetching the problems:', error);
      }
    };

    fetchProblems();
  }, [root, userId]);

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
    const matchesSearch = searchKeyword
      ? problem.title.toLowerCase().includes(searchKeyword.toLowerCase())
      : true;
    return matchesDifficulty && matchesTag && matchesSearch;
  });

  // Calculate pagination
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="d-flex justify-content-between mb-4">
          <h1>Practice Problems</h1>
          {isAdmin && (
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>+ Create New Problem</button>
          )}
        </div>
        <div className="filters mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex">
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
              className="form-select me-3 custom-select"
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
          <div className="input-group search-box">
            <input
              type="text"
              className="form-control custom-input search"
              placeholder="Search problems..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <span className="input-group-text search">🔍</span>
          </div>
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
            {currentProblems.map(problem => (
              <tr key={problem._id} className="problem-row">
              <td>
                <Link to={`/problems/${problem._id}`} className="problem-link">
                  {problem.title}
                </Link>
                {problem.accepted && <span className="check-mark">✅</span>}
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
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div>Page {currentPage} of {totalPages}</div>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default PracticeProblem;
