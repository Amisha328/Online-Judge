import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './ProbelmDetails.css';
import CodeDialog from './CodeDialog';

const ProblemDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const contestId = location.state?.contestId || null;
  // console.log(`Initial contestId: ${contestId}`);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('input');
  const [problemTab, setProblemTab] = useState('problem');
  const [verdict, setVerdict] = useState('');
  const [verdicts, setVerdicts] = useState([]);
  const [userId, setUserID] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [verdictStatus, setVerdictStatus] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
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
        setUserID(data.id);
      } catch (error) {
        console.error("Verification error:", error);
        navigate("/login");
      }
    };
    verifyCookie();
  }, []);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${root}/problems/${id}`);
        // console.log(response.data);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching the problem:', error);
      }
    };

    const fetchSubmissions = async () => {

      try {
        let response;
        if (contestId) {
          response = await axios.get(`${root}/competition/submissions/${id}/${userId}/${contestId}`);
        } else {
          response = await axios.get(`${root}/problems/submissions/${id}/${userId}`);
        }
        const sortedSubmissions = response.data.sort((a, b) => new Date(b.submissionTime) - new Date(a.submissionTime));
        setSubmissions(sortedSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };
  

    fetchProblem();
    fetchSubmissions();
  }, [id, userId, contestId]);

  useEffect(() => {
    const boilerplateCode = {
      cpp: `#include <bits/stdc++.h>

int main() { 
  std::cout << "Hello from C++!"; 
  return 0; 
}`,
      java: `class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello from Java!!");
  }
}`,
      py: `print("Hello from Python!!")`,
      c: `#include <stdio.h>

int main() {
  printf("Hello from C language!!");
  return 0;
}`
    };

    setCode(boilerplateCode[language]);
  }, [language]);

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value);
  };
  
  const handleViewClick = (submission) => {
    setSelectedCode(submission.submissionCode);
    setSelectedLanguage(submission.language);
    setShowDialog(true);
  };

  const handleRun = async () => {
    const payload = {
      language,
      code,
      input,
      timeLimit: problem.timeLimit
    };
    setLoading(true);
    setOutput("");
    setActiveTab('output');
    try {
      const { data } = await axios.post(import.meta.env.VITE_CODE_RUN, payload);
      // console.log(data);
      setOutput(data.output);
    } catch (error) {
      // console.log("Error", error.response);
      setOutput(`Error: ${error.response.data.error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      userId,
      language,
      code,
      problemId: id,
      timeLimit: problem.timeLimit
    };
    if (contestId) {
      payload.contestId = contestId; // Add contestId to payload if it exists
    }
    setLoading(true);
    setOutput("");
    setVerdict("");
    setVerdicts([]);
    setActiveTab('verdict');
    try {
      const { data } = await axios.post(import.meta.env.VITE_CODE_SUBMIT, payload);
      setVerdicts(data.verdicts);
      setVerdict(data.result);
      (data.status == false)? setVerdictStatus('red'): setVerdictStatus('green');
    } catch (error) {
      setActiveTab('output');
      setOutput(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-success';
      case 'Medium':
        return 'badge-warning';
      case 'Hard':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-md-6">
        <h2><b>{problem && problem.title}</b></h2>
        <span className={`badge ${getBadgeColor(problem && problem.difficulty)}`}>
        {problem && problem.difficulty}
      </span>
          <div className="tab-container">
            <div
              className={`tab ${problemTab === 'problem' ? 'tab-active' : ''}`}
              onClick={() => setProblemTab('problem')}
            >
              Problem
            </div>
            <div
              className={`tab ${problemTab === 'submissions' ? 'tab-active' : ''}`}
              onClick={() => setProblemTab('submissions')}
            >
              Submissions
            </div>
          </div>
          {problemTab === 'problem' && (
            <div className="problem-description">
              {problem ? (
                <>
                  <br/>
                  <h4>Description:</h4>
                  <span className="problem-text">{problem.description}</span> <br /><br />
                  <h4>Sample Test Cases:</h4>
                  {problem.sampleTestCases && problem.sampleTestCases.length > 0 ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Input</th>
                          <th>Output</th>
                          <th>Explanation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {problem.sampleTestCases.map((testCase, index) => (
                          <tr key={index}>
                            <td className="problem-text">{testCase.input}</td>
                            <td className="problem-text">{testCase.expectedOutput}</td>
                            <td className="problem-text">{testCase.explanation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No sample test cases available.</p>
                  )}
                  {/* <h5><b>Maximum TimeLimit:</b></h5> */}
                  {/* <span className="problem-text">{problem.timeLimit / 1000} sec</span> */}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          )}
          {problemTab === 'submissions' && (
            <div className="submissions-list">
              <br/>
              <h3>Your Submissions</h3>
              {submissions.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Language</th>
                      <th>Verdict</th>
                      <th>Time</th>
                      <th>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, index) => (
                      <tr key={index}>
                        <td>{submission.language}</td>
                        <td>{submission.verdict}</td>
                        <td>{new Date(submission.submissionTime).toLocaleString()}</td>
                        <td><button className="btn btn-dark" onClick={() => handleViewClick(submission)}>View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No submissions found.</p>
              )}
            </div>
          )}
        </div>
            <div className="col-md-6 editor-container">
              <div className="editor-header">
                <select
                  className="form-select me-2"
                  value={language}
                  onChange={handleChangeLanguage}
                >
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="py">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <div className="bg-light p-3 editor-wrapper">
                <Editor
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => highlight(code, languages.js)}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 13,
                      outline: 'none',
                      border: 'none',
                      minHeight: '100%',
                      overflow: 'auto'
                  }}
                />
              </div>
              <div className="button-container mt-3">
                <button onClick={handleRun} className="btn btn-primary me-2">Run</button>
                <button onClick={handleSubmit} className="btn btn-success">Submit</button>
              </div>
             
              <div className="tab-container">
            <div
              className={`tab ${activeTab === 'input' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('input')}
            >
              Input
            </div>
            <div
              className={`tab ${activeTab === 'output' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('output')}
            >
              Output
            </div>
            <div
              className={`tab ${activeTab === 'verdict' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('verdict')}
            >
              Verdict
            </div>
          </div>
          {activeTab === 'input' && (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="outputbox mt-4 bg-dark text-white p-3 rounded"
              style={{ 
                height: '200px',
                fontSize: 15
              }}
              placeholder="Enter your input here..."
            ></textarea>
          )}
          {activeTab === 'output' && (
            <div className="outputbox mt-4 bg-dark text-white p-3 rounded" style={{ height: '200px' }}>
              {loading && <div className="loader mt-4"></div>}
              <p style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 15
              }}>{output}</p>
            </div>
          )}
          {activeTab === 'verdict' && (
          <div className="outputbox mt-4 bg-dark text-white p-3 rounded" style={{ height: '200px', overflowY: 'auto' }}>
            {loading && <div className="loader mt-4"></div>}
            <div style={{marginBottom: '5px', fontSize: 20}}>{verdict}</div>
            {verdicts && verdicts.length > 0 ? (
              verdicts.map((verdict, index) => (
                <div
                  key={index}
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    marginBottom: '5px',
                    borderRadius: '5px',
                    marginLeft: '10px',
                    backgroundColor: verdict.status ? 'green' : 'red',
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 15,
                    color: 'white'
                  }}
                >
                  {verdict.verdict}
                </div>
              ))
            ) : (
              <p>No verdict available.</p>
            )}
          </div>
          )}
            </div>
          </div>
          <CodeDialog
            show={showDialog}
            handleClose={() => setShowDialog(false)}
            code={selectedCode}
            language={selectedLanguage}
          />
        </div>
  );
};

export default ProblemDetail;