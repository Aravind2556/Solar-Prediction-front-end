import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DContext } from '../context/Datacontext';


const Navbar = () => {
  const navigate = useNavigate()
  const apiurl = process.env.REACT_APP_API_URL
  const {Auth}= useContext(DContext)
  console.log("Auth By navbar",Auth)


  function isLogout() {
    fetch(`${apiurl}/logout`, {
      method: "GET",
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message)
        if (data.success === true) {
          navigate('/')
          window.location.reload()

        }
        else {
          console.log(data.message)
        }
      })
      .catch(err => {
        console.log("Logout deFetching error", err)
      })
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light text-primary sticky-top border-bottom bg-light">
      <div className="container">
        {/* Logo / Brand */}

      
        <a className="navbar-brand fw-bold border border-primary rounded text-primary px-2" href="/">
          Solar Prediction
        </a> 
       

        
        <button className="btn btn-dark" onClick={isLogout}>{Auth === null  ? 'Login' : 'Logout' }</button>
       
        
        {/* Toggle Button for Mobile */}
        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        
        {/* Collapsible Navbar */}
        {/* <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/Home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                About
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#service1">
                    Service 1
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#service2">
                    Service 2
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#service3">
                    Service 3
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Login" >
                login
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
