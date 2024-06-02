import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './ProbelmDetails.css'

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('input');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching the problem:', error);
      }
    };

    fetchProblem();
  }, [id]);

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
      
        useEffect(() => {
          setCode(boilerplateCode[language]);
        }, [language]);
      
        const handleChangeLanguage = (event) => {
          setLanguage(event.target.value);
        };
      
        const handleSubmit = async () => {
          const payload = {
            language,
            code,
            input
          };
          setLoading(true);
          setOutput("");
          setActiveTab('output');
          try {
            const { data } = await axios.post('http://localhost:5000/run', payload);
            console.log(data);
            setOutput(data.output);
            setLoading(false);
          } catch (error) {
            console.log(error.response);
          }
        }

  return (
          <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-md-6 problem-description">
              {problem ? (
                <>
                  <h2><b>{problem.title}</b></h2>
                  <span className="problem-text">{problem.description}</span> <br/><br/>
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
            </>
          ) : (
            <p>Loading...</p>
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
                      fontSize: 12,
                      outline: 'none',
                      border: 'none',
                      minHeight: '100%',
                      overflow: 'auto'
                  }}
                />
              </div>
              <div className="button-container mt-3">
                <button onClick={handleSubmit} className="btn btn-primary me-2">Run</button>
                <button className="btn btn-success">Submit</button>
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
          </div>
          {activeTab === 'input' && (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="outputbox mt-4 bg-dark text-white p-3 rounded"
              style={{ height: '150px'}}
            ></textarea>
          )}
          {activeTab === 'output' && (
            <div className="outputbox mt-4 bg-dark text-white p-3 rounded" style={{ height: '150px' }}>
              {loading && <div className="loader mt-4"></div>}
              <p style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}>{output}</p>
            </div>
          )}
            </div>
          </div>
        </div>
  );
};

export default ProblemDetail;