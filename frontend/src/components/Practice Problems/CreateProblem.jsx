import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import { ToastContainer, toast } from "react-toastify";

export default function CreateProblem() {
          let navigate = useNavigate();
          const root = import.meta.env.VITE_BACKEND_URL;
          const [currentProblem, setCurrentProblem] = useState({
                    title: '',
                    description: '',
                    difficulty: '',
                    tags: '',
                    timeLimit: 0,
                    sampleTestCases: [{ input: '', expectedOutput: '', explanation: '' }],
                    hiddenTestCases: [{ input: '', expectedOutput: '' }]
          });
          const handleSubmit = async (e) => {
                    e.preventDefault();
                    try {
                        const response = await axios.post(`${root}/problems/add`, currentProblem);
                        // console.log(response);
                       
                        toast(`${response.data.message}!`, { position: "top-right" });
                      
                        setCurrentProblem({ title: '', description: '', difficulty: '', tags: '', timeLimit: 0, sampleTestCases: [{ input: '', expectedOutput: '', explanation: '' }] });
                    } catch (error) {
                        // console.log(error.response);
                        toast("Unauthorized request", { position: "top-right" })
                        console.error('Error creating problem:', error);
                    }
          };

          
          const handleFormChange = (e) => {
            const { name, value } = e.target;
            setCurrentProblem({
                ...currentProblem,
                [name]: name === 'timeLimit' ? Number(value) : value
            });
          };
        
          const handleSampleTestCaseChange = (index, e) => {
            const { name, value } = e.target;
            const sampleTestCases = [...currentProblem.sampleTestCases];
            sampleTestCases[index][name] = value;
            setCurrentProblem({ ...currentProblem, sampleTestCases: sampleTestCases });
          };
        
          const handleHiddenTestCaseChange = (index, e) => {
            const { name, value } = e.target;
            const hiddenTestCases = [...currentProblem.hiddenTestCases];
            hiddenTestCases[index][name] = value;
            setCurrentProblem({ ...currentProblem, hiddenTestCases: hiddenTestCases });
          };
        
          const handleAddSampleTestCase = () => {
            setCurrentProblem({
              ...currentProblem,
              sampleTestCases: [...currentProblem.sampleTestCases, { input: '', expectedOutput: '', explanation: '' }]
            });
          };
        
          const handleRemoveSampleTestCase = (index) => {
            const sampleTestCases = [...currentProblem.sampleTestCases];
            sampleTestCases.splice(index, 1);
            setCurrentProblem({ ...currentProblem, sampleTestCases: sampleTestCases });
          };
        
          const handleAddHiddenTestCase = () => {
            setCurrentProblem({
              ...currentProblem,
              hiddenTestCases: [...currentProblem.hiddenTestCases, { input: '', expectedOutput: '' }]
            });
          };
        
          const handleRemoveHiddenTestCase = (index) => {
            const hiddenTestCases = [...currentProblem.hiddenTestCases];
            hiddenTestCases.splice(index, 1);
            setCurrentProblem({ ...currentProblem, hiddenTestCases: hiddenTestCases });
          };
        

        const handleCancel = () =>{
          navigate('/problems')
        }

  return (
<>
<NavBar/>
    <div className="container">
      <h1>Create Problem</h1>
      <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={currentProblem.title} onChange={handleFormChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={currentProblem.description} onChange={handleFormChange} required />
              </div>
               <div className="mb-3">
                <label className="form-label">Time Limit (ms)</label>
                <input type="number" className="form-control" name="timeLimit" value={currentProblem.timeLimit} onChange={handleFormChange} required />
              </div>
              <h4>Sample Test Cases:</h4>
              {currentProblem.sampleTestCases && currentProblem.sampleTestCases.map((testCase, index) => (
                <div key={index} className="test-case">
                  <div className="mb-3">
                    <label className="form-label">Input</label>
                    <textarea className="form-control" name="input" value={testCase.input} onChange={(e) => handleSampleTestCaseChange(index, e)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Expected Output</label>
                    <textarea className="form-control" name="expectedOutput" value={testCase.expectedOutput} onChange={(e) => handleSampleTestCaseChange(index, e)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Explanation</label>
                    <textarea className="form-control" name="explanation" value={testCase.explanation} onChange={(e) => handleSampleTestCaseChange(index, e)} />
                  </div>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveSampleTestCase(index)}>Remove Test Case</button>
                  <button type="button" className="btn btn-primary mx-3 btn-sm" onClick={handleAddSampleTestCase}>Add Test Case</button>
                </div>
              ))}
           <br/>
           <h4>Hidden Test Cases:</h4>
            {currentProblem.hiddenTestCases && currentProblem.hiddenTestCases.map((testCase, index) => (
              <div key={index} className="test-case">
                 <div className="mb-3">
                    <label className="form-label">Input</label>
                    <textarea className="form-control" name="input" value={testCase.input} onChange={(e) => handleHiddenTestCaseChange(index, e)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Expected Output</label>
                    <textarea className="form-control" name="expectedOutput" value={testCase.expectedOutput} onChange={(e) => handleHiddenTestCaseChange(index, e)} required />
                  </div>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveHiddenTestCase(index)}>Remove Test Case</button>
                  <button type="button" className="btn btn-primary mx-3 btn-sm" onClick={handleAddHiddenTestCase}>Add Test Case</button>
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
              <button type="submit" className="btn btn-primary">Create Problem</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
            </form>
          </div>
          <ToastContainer />
    </>
  );
}
