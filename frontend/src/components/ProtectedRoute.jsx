import React, { useEffect, useState } from 'react';
import { Navigate,Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const ProtectedRoute = ({ adminRoute = false, redirectPath = '/login', children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  let navigate = useNavigate();
  const root = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { data } = await axios.post(
          `${root}/verify-token`, 
          {}, 
          { withCredentials: true }
        );
        setIsAuthenticated(data.status);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  }

  if (isAuthenticated === null) {
     return <div>Loading...</div>;
  }

  if(adminRoute && !isAdmin){
    return (
      <>
      <div className="d-flex flex-column" style={{alignItems:"center", justifyContent:"center"}}>
        <div style = {{color:"red", fontSize:"40px", fontWeight:"bold"}}>Unauthorized</div>
        <button className="btn btn-dark" onClick={handleBack}>Back</button>
      </div>
      </>
    )
  }

  return isAuthenticated ? children : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
