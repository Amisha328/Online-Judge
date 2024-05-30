import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import './Home.css'
import { Link } from "react-router-dom";

export default function Home() {
  return (
      <>
           <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                    O<i>nline</i> J<i>udge</i>
                    </Link>
                    <button
                          className="navbar-toggler"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#navbarSupportedContent"
                          aria-controls="navbarSupportedContent"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
                          <ul className="navbar-nav me-3 mb-2 mb-lg-0">
                            <li className="nav-item">
                              <Link className="nav-link active" aria-current="page" to="/signup">
                                SignUp
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link active" to="/login">Login</Link>
                            </li>
                          </ul>
                        </div>
          </div>
          </nav>

          <div class="banner-title">
                    <h1 class="wordCarousel">Welcome to<span> Online Judge</span><br/> 
                    <p className="welcome-text">
                    Online Judge is Link platform for hosting coding challenges and competitions. 
                    Participate in coding contests, practice problems, and track your progress.
                    </p><br/>
                    Let's 
                                        <div>
                                                  <ul class="flip4">
                                                            <li>code!</li>
                                                            <li>compete!</li>
                                                            <li>practice!</li>
                                                            <li>learn!</li>
                                                  </ul>
                                        </div> 
                                        </h1>
          </div>
    </>
  )
}
