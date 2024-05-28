import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import { ToastContainer, toast } from "react-toastify";

export default function UpdateProblem() {
          let navigate = useNavigate();
          const { id } = useParams();
          const [currentProblem, setCurrentProblem] = useState({
                    title: '',
                    description: '',
                    difficulty: '',
                    tags: '',
                    sampleTestCases: [{ input: '', expectedOutput: '', explanation: '' }]
          });

          useEffect(() => {
                    const fetchProblem = async () => {
                      try {
                        const response = await axios.get(`http://localhost:5000/problems/${id}`);
                        const problem = response.data;
                        setCurrentProblem(problem);
                      } catch (error) {
                        console.error('Error fetching problem:', error);
                      }
                    };
                
                    fetchProblem();
                  }, [id]);
          const handleSubmit = async (e) => {
                    e.preventDefault();
                    try {
                        const response = await axios.put(`http://localhost:5000/problems/${id}`, currentProblem);
                        console.log(response);
                        toast(`${response.data.message}!`, { position: "top-right" });
                        setCurrentProblem({ title: '', description: '', difficulty: '', tags: '', sampleTestCases: [{ input: '', expectedOutput: '', explanation: '' }] });
                    } catch (error) {
                        console.error('Error updating the problem:', error);
                    }
          };

          
        const handleFormChange = (e) => {
          const { name, value } = e.target;
          setCurrentProblem({ ...currentProblem, [name]: value });
        };
      
        const handleTestCaseChange = (index, e) => {
          const { name, value } = e.target;
          const testCases = [...currentProblem.sampleTestCases];
          testCases[index][name] = value;
          setCurrentProblem({ ...currentProblem, sampleTestCases: testCases });
        };
      
        const handleAddTestCase = () => {
          setCurrentProblem({
            ...currentProblem,
            sampleTestCases: [...currentProblem.sampleTestCases, { input: '', expectedOutput: '', explanation: '' }]
          });
        };
      
        const handleRemoveTestCase = (index) => {
          const testCases = [...currentProblem.sampleTestCases];
          testCases.splice(index, 1);
          setCurrentProblem({ ...currentProblem, sampleTestCases: testCases });
        };

        const handleCancel = () =>{
          navigate('/problems')
        }
  return (
    <>
    <NavBar/>
    <div className="container">
      <h1>Update Problem</h1>
      <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={currentProblem.title} onChange={handleFormChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={currentProblem.description} onChange={handleFormChange} required />
              </div>
              {currentProblem.sampleTestCases.map((testCase, index) => (
                <div key={index} className="test-case">
                  <div className="mb-3">
                    <label className="form-label">Input</label>
                    <textarea className="form-control" name="input" value={testCase.input} onChange={(e) => handleTestCaseChange(index, e)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Expected Output</label>
                    <textarea className="form-control" name="expectedOutput" value={testCase.expectedOutput} onChange={(e) => handleTestCaseChange(index, e)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Explanation</label>
                    <textarea className="form-control" name="explanation" value={testCase.explanation} onChange={(e) => handleTestCaseChange(index, e)} />
                  </div>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveTestCase(index)}>Remove Test Case</button>
                  <button type="button" className="btn btn-primary mx-3 btn-sm" onClick={handleAddTestCase}>Add Test Case</button>
                </div>
              ))}
               
              <div className="mb-3">
                <label className="form-label">Difficulty</label>
                <select className="form-select" name="difficulty" value={currentProblem.difficulty} onChange={handleFormChange} required>
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Tags</label>
                <input type="text" className="form-control" name="tags" value={currentProblem.tags} onChange={handleFormChange} placeholder="Comma separated tags" />
              </div>
              <button type="submit" className="btn btn-primary">Update Problem</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
            </form>
          </div>
          <ToastContainer />
    </>
  )
}
