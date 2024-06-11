// https://github.com/Amisha328/Online-Judge

import { useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './SignUp.css';
// import { FaGoogle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

function SignUp() {
  let navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    phoneNo: "",
    email: "",
    password: "",
  });

  const [messages, setMessages] = useState({
    name: "",
    phoneNo: "",
    email: "",
    password: "",
    server: ""
  });
  
  const [touched, setTouched] = useState({
    name: false,
    phoneNo: false,
    email: false,
    password: false,
  });
  
  function validateName(name){
    console.log("Validate name called");
    console.log(name);
    if(name.toString().length < 3) {
      setMessages({
        ...messages,
        name: "Name should should have min 3 characters",
      });
    }else {
      setMessages({
        ...messages,
        name: "",
      });
    }
}
  function validatePhone(phoneNo){
    console.log("Phone validation "+phoneNo);
    if(phoneNo.toString().length < 10 || phoneNo.toString().length > 10) 
      {
        setMessages({
          ...messages,
          phoneNo: "It is a required field with 10 digits",
        });
    }
    else {
      setMessages({
        ...messages,
        phoneNo: "",
      });
    }
  }
  function validateEmail(email){
    if (!email) {
      setMessages({
        ...messages,
        email: "Email address is required",
      });
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/; 
  
    if (!emailRegex.test(email)) {
      setMessages({
        ...messages,
        email: "Please enter a valid email address",
      });
    }
    else {
      setMessages({
        ...messages,
        email: "",
      });
    }
  }
  function validatePassword(password){
    
    if(password.toString().length < 8 || password.toString().length > 12) {
      setMessages({
        ...messages,
        password: "It is a required field and length should be between 8 and 12 characters",
      });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(password)){
      setMessages({
        ...messages,
        password: "Password must contain atleast 8 char with one uppercase,one lowercase, one digit, and one special character",
      });
    }
    else {
      setMessages({
        ...messages,
        password: "",
      });
    }
  }
  
  const handleOnBlur = (event) => {
    if (event.target) {
      console.log(event);
      switch (event.target.name) {
        case "name":
          setTouched({ ...touched, name: true });
          validateName(user.name)
          break;
        case "phoneNo":
          setTouched({ ...touched, phoneNo: true });
          validatePhone(user.phoneNo);
          break;
        case "email":
          setTouched({ ...touched, email: true });
          validateEmail(user.email);
          break;
        case "password":
          setTouched({ ...touched, password: true });
          validatePassword(user.password);
          break;
        default:
          break;
      }
    }
  }
  
  const handleChange = (event) => {
    if (event?.target) {
      console.log(event);
      switch (event.target.name) {
        case "name":
          if (touched.name) {
            validateName(event.target.value);
          }
          break;
        case "phoneNo":
          if (touched.phoneNo) {
            setUser({...user, "phoneNo":event.target.value});
            validatePhone(event.target.value);
          }
          break;
        case "email":
          if (touched.email){
            validateEmail(event.target.value);
          }
          break;
        case "password":
          if (touched.password){
            validatePassword(event.target.value);
          }
          break;
        default:
          break;
      }
      
      setUser({ ...user, [event.target.name]: event.target.value});
    }
  }

    const disableButton = () => {
      if(user.name === "" || user.email === "" || user.phoneNo === "" || user.password === "") return true;
      if(messages.name !== "" || messages.email !== "" || messages.phoneNo !== "" || messages.password !== "") return true;
      return false;
    }

    const handleRegister = async (event) => {
      event.preventDefault();
      console.log(
        `Name: ${user.name} phoneNo: ${user.phoneNo} Email: ${user.email} Password: ${user.password}`
      );
      
      // try{
      //     const response = await fetch("http://localhost:5000/signup", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body:JSON.stringify(user),
      //     });
      //     console.log(response);
      //   } 
      // catch(error){
      //   console.log('There was an error registering the user!', error);
      // }

      try {
        const response = await axios.post("http://localhost:5000/signup", user);
        console.log(response);
        navigate('/login');
      } catch (error) {
        if (error.response && error.response.data) {
          setMessages({ ...messages, server: error.response.data });
        } else {
          setMessages({ ...messages, server: "An error occurred. Please try again." });
        }
      }
    
     // navigate('/login');
    };
    return (
      <>
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
           <a className="navbar-brand" href="/">
            O<i>nline</i> J<i>udge</i>
          </a>
      </div>
      </nav>
     
      <div className="form-container container-fluid d-flex align-items-center justify-content-center">
          <div className="card card-register">
        <form>
          <h2 className="title">SignUp</h2>
          <div className="input-container">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      onBlur={handleOnBlur}
                    />
                    {messages.name && <div className="error-prompt">{messages.name}</div>}
                  </div>
                  <div className="input-container">
                    <label>Phone No:</label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={user.phoneNo}
                      onChange={handleChange}
                      onBlur={handleOnBlur}
                    />
                    {messages.phoneNo && <div className="error-prompt">{messages.phoneNo}</div>}
                  </div>
                  <div className="input-container">
                    <label>Email id:</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      onBlur={handleOnBlur}
                    />
                    {messages.email && <div className="error-prompt">{messages.email}</div>}
                  </div>
                  <div className="input-container">
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      onBlur={handleOnBlur}
                    />
                    {messages.password && <div className="error-prompt">{messages.password}</div>}
                  </div>
                  <div className="form-submit-container">
                    <button
                      type="submit"
                      onClick={handleRegister}
                      className="register-btn"
                      disabled={disableButton()}
                    >
                      Register
                    </button>
                    <div className="login">
                      <Link className ="signup-link" to="/login">Login</Link>
                      <span>with your existing account</span>
                    </div>
                    {messages.server && <div className="error-prompt">{messages.server}</div>}
                    {/* <div className="or">OR</div>
                    <button className="google-btn">
                        <FaGoogle className="google-icon"/> Sign up with Google
                     </button> */}
                  </div>
                </form>
          </div>    
          </div> 
      </>
    );
  }
export default SignUp;
