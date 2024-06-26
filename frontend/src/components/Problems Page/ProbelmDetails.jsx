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
  const [userId, setUserID] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [verdictStatus, setVerdictStatus] = useState('');
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
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching the problem:', error);
      }
    };

    const fetchSubmissions = async () => {
      // try {
      //   const response = await axios.get(`${root}/problems/submissions/${id}/${userId}`)
      //   setSubmissions(response.data);
      // } catch (error) {
      //   console.error('Error fetching submissions:', error);
      // }

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
      cpp: `#include <iostream>

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
      setOutput(data.output);
    } catch (error) {
      console.log(error.response);
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
    // console.log(`contestId: ${contestId}`)
    if (contestId) {
      payload.contestId = contestId; // Add contestId to payload if it exists
    }
    setLoading(true);
    setOutput("");
    setVerdict("");
    setActiveTab('verdict');
    try {
      const { data } = await axios.post(import.meta.env.VITE_CODE_SUBMIT, payload);
      setVerdict(data.verdict);
      (data.status == false)? setVerdictStatus('red'): setVerdictStatus('green');
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-md-6">
        <h2><b>{problem && problem.title}</b></h2>
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
                  <h5><b>Constraints:</b></h5>
                  <span className="problem-text">{problem.timeLimit / 1000} sec</span>
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
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, index) => (
                      <tr key={index}>
                        <td>{submission.language}</td>
                        <td>{submission.verdict}</td>
                        <td>{new Date(submission.submissionTime).toLocaleString()}</td>
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
              style={{ height: '200px'}}
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
            <div className="outputbox mt-4 bg-dark text-white p-3 rounded" style={{ height: '200px' }}>
              {loading && <div className="loader mt-4"></div>}
              <p className = {verdictStatus} style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 15
              }}>{verdict}
              </p>
            </div>
          )}
            </div>
          </div>
        </div>
  );
};

export default ProblemDetail;