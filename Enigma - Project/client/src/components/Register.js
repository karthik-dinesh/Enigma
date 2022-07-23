import React, { Component } from "react";
import SecureShareContract from "../contracts/SecureShare.json";
import getWeb3 from "../getWeb3";
import { Link } from "react-router-dom";
import "../styles/Register.css";
import Swal from "sweetalert2";

var accountType;

const refreshWindow = () => {
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  }
};

class Register extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
    
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

    
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SecureShareContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SecureShareContract.abi,
        deployedNetwork && deployedNetwork.address
      );

     
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
    
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    var submitButton = document.getElementById("submit");
    var rS = document.getElementById("role-select");

    rS.addEventListener("change", () => {
      accountType = rS.options[rS.selectedIndex].value;
      console.log("uberrr", accountType);
    });

    const { accounts, contract } = this.state;
    submitButton.addEventListener("click", () => {
      var password = document.getElementById("reg-password").value;
      var username = document.getElementById("reg-username").value;
      var address = document.getElementById("reg-address").value;

      contract.methods
        .registerUser(username, password, address, accountType)
        .send({ from: accounts[0] })
        .then((data) => {
          console.log("added user", data);

          Swal.fire({
            icon: "success",
            title: "You have been Registerd Successfully 🎉",
            showConfirmButton: false,
            timer: 2000,
          });
          window.location = "http://localhost:3000/login";
        });
    });
  };
  render() {
    if (!this.state.web3) {
      refreshWindow();
    }
    return (
      <div className="register-body">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-auto col-sm-auto rounded">
              <h2 id="reg-head">Sign Up</h2>
              <div id="form-container">
                <div id="form-items">
                  <h6 id="item-head-1">-- Register your account here --</h6>
                  <br></br>
                  <input
                    placeholder="Enter your UserName"
                    type="name"
                    id="reg-username"
                  />
                  <br></br>
                  <input
                    placeholder="Enter your Password"
                    type="password"
                    id="reg-password"
                  />
                  <br></br>
                  <input
                    placeholder="Enter your Ethereum Address"
                    type="text"
                    id="reg-address"
                  />
                  <br></br>
                  <select id="role-select">
                    <option>-- Select your Role --</option>
                    <option value="Pathology Lab">Pathology Lab</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Police Station">Police Station</option>
                  </select>

                  <div id="button_container">
                    <button id="submit"> Register </button>
                  </div>

                  <h6 id="reg-extra">
                    Already have an account?
                    <Link to="login" id="login-xtra">
                      {" "}
                      SignIn here.
                    </Link>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
