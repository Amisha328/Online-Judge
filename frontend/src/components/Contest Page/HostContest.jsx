import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HostContest.css';
import NavBar from '../NavBar/NavBar';
import { ToastContainer, toast } from "react-toastify";

const HostContest = () => {
    const [title, setTitle] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/problems');
                setProblems(response.data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            }
        };

        fetchProblems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            start_date_time: startDateTime,
            end_date_time: endDateTime,
            problems_included: selectedProblems
        };

        try {
            const response = await axios.post('http://localhost:5000/create-contest', payload);
            console.log('Competition created:', response.data);
            toast(`${response.data.message}!`, { position: "top-right" });
        } catch (error) {
            toast("Unauthorized request", { position: "top-right" })
            console.error('Error creating competition:', error);
        }
    };

    const handleProblemChange = (e) => {
        const value = e.target.value;
        setSelectedProblems(
            e.target.checked
                ? [...selectedProblems, value]
                : selectedProblems.filter((problem) => problem !== value)
        );
    };

    return (
        <>
        <NavBar/>
        <div className="container mt-5">
            <h1>Host a Contest</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Start Date & Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Date & Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Problems</label>
                    <div className="form-check">
                        {problems.map((problem) => (
                            <div key={problem._id}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    value={problem._id}
                                    onChange={handleProblemChange}
                                />
                                <label className="form-check-label">{problem.title}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{"marginTop":"20px"}}>Create Contest</button>
            </form>
        </div>
        <ToastContainer />
        </>
    );
};

export default HostContest;
