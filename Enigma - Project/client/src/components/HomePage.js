import React from "react";
import {Link } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  return (
    <div className="HomePage">
      <div id="nav-bar">
        <ul id="nav-items">

        <Link to="/">
            <li style={{marginLeft:'-50px'}}>
            <img src="assets/enigmalogo.png" alt="" id="logo" />
            </li>
          </Link>
          <Link to="/login">
            <li style={{marginLeft:'985px'}}>
              <label for="login" id="login">
                <p id="ww">Sign In</p>
              </label>
            </li>
          </Link>

          <Link to="/register">
            <li>
              <label for="register" id="register">
                <p id="ww">Register</p>
              </label>
            </li>
          </Link>
        </ul>
      </div>

      <div id="content">
        <div id="description">
          <h1>
            ENIGMA
            <hr style={{width:'190px'}} />
            
            </h1>
            <h2>
            A <span>Secure</span> Forensic Data Sharing System
            <br />
             using Blockchain
          </h2>
          <br/>
          <h5>Project CoE Digital Forensics Intelligence Supported by VGST
            <br/>Department of ITBT, Government of Karnataka</h5>
            <br />
            <img src="assets/scem.png" alt="y343" id="bb" />
        </div>

        <img src="assets/image1.png" alt="yoooo" id="bc-img" />

        <div id="buttons">
          <Link to="login">
            <input type="button" value="Get Started" id="get-started" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;