import React, { Component } from "react";
import { Link } from "react-router-dom";
import getWeb3 from "./getWeb3";
import SecureShareContract from "./contracts/SecureShare.json";
import ipfs from "./ipfs";
import Swal from "sweetalert2";
import "./styles/Share.css";

const refreshWindow = () => {
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  }
};

class Share extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
   
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SecureShareContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SecureShareContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    var file;
    var bufferedFile;
    var fileId;
    var selectedReceiver;

    var chooseButton = document.getElementById("choose");
    var uploadButton = document.getElementById("upload");

    var fileAddedIcon = document.getElementById("file-added");
    var uploadIcon = document.getElementById("upload-icon");

    var loader = document.getElementById("loader");
    var pw = document.getElementById("pw");
    var beforeAdd = document.getElementById("before-add");
    var afterAdd = document.getElementById("after-add");
    var fileName = document.getElementById("file-name");

    var selectReceiver = document.getElementById("select-receiver");
    var chooseButton = document.getElementById("choose");
    var uploadButton = document.getElementById("upload");

    var cusUploadBtn = document.getElementById("share-btn");

      var account = document.getElementById("account");

    const { accounts, contract } = this.state;
    console.log("Account",accounts[0]);
    fileAddedIcon.style.display = "none";
    loader.style.display = "none";
    pw.style.display = "none";

    cusUploadBtn.style.display = "none";

    Swal.fire({
      title: "Make sure you are using the same MetaMask Account ✔",
      showConfirmButton: false,
      icon: "info",
      timer: 2500,
    });
   
  
    contract
      .getPastEvents("AddedUser", {
        fromBlock: 0,
        toBlock: "latest",
      })
      .then((val) => {
        var size = val.length;

        for (var index = 0; index < size; index++) {
          var name = val[index].returnValues.name;
          var address = val[index].returnValues.accountAddress;
          console.log("AD",address);
          var accountType = val[index].returnValues.accountType;
          console.log("BC",accountType);
          if(accountType=="Doctor"){
            selectReceiver.innerHTML += `<option value=${address}>${name} - ${accountType}</option>`;
          }

          if (accounts[0] == address) {
            account.innerHTML = ` ${name} -  &nbsp&nbsp${accountType} Account`;
          }
          
        }
      });

    selectReceiver.addEventListener("change", () => {
      selectedReceiver =
        selectReceiver.options[selectReceiver.selectedIndex].value;
    });

    chooseButton.addEventListener("change", (event) => {
      event.preventDefault();

      file = event.target.files[0];

      fileAddedIcon.style.display = "block";
      cusUploadBtn.style.display = "block";
      uploadIcon.style.display = "none";
      beforeAdd.style.display = "none";

      afterAdd.innerText = `You have selected the file ${file.name}\n
        Click on the Share Button to Proceed`;

      const reader = new window.FileReader();

      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        bufferedFile = Buffer.from(reader.result);
      };
    });

    uploadButton.addEventListener("click", (event) => {
      event.preventDefault();

      var d = new Date().toLocaleString();

      fileAddedIcon.style.display = "none";
      afterAdd.innerText = "";
      loader.style.display = "block";
      pw.style.display = "block";
      cusUploadBtn.style.display = "none";

      var fileName = file.name;
      var receiver = selectedReceiver;

      ipfs.files.add(bufferedFile, (err, res) => {
        if (err) {
          return console.log("Error", err);
        }

        contract.methods
          .uploadHash(res[0].hash, fileName, accounts[0], receiver, d)
          .send({ from: accounts[0] })
          .then((data) => {
            loader.style.display = "none";
            pw.style.display = "none";

            uploadIcon.style.display = "block";
            beforeAdd.style.display = "block";
            cusUploadBtn.style.display = "none";

            if (localStorage.getItem(accounts[0]) == null) {
              localStorage.setItem(accounts[0], "[]");
            }

            var oldData = JSON.parse(localStorage.getItem(accounts[0]));
            oldData.push(fileName);

            if (res.value != null) {
              localStorage.setItem(accounts[0], JSON.stringify(oldData));
            }

            Swal.fire({
              title: "File Shared Successfully 🎉",
              icon: "success",
              button: "OK",
            });

            contract.methods
              .getFileId(receiver)
              .call()
              .then((val) => {
                fileId = val;
                console.log("board dash hctib", fileId);
                contract.methods
                  .getFile(fileId - 1, receiver)
                  .call()
                  .then((res) => {
                    console.log(res);
                  });
              });
          });
      });
    });
  };

  render() {
    if (!this.state.web3) {
      refreshWindow();
    }
    return (

      <div>
         <nav id="nav-bar-db">
              <ul id="nav-items-db">
                <Link to="/">
                  <li id="home">Home</li>
                </Link>
                <Link to="#">
                  <li id="account">Your Account</li>
                </Link>
                <Link to="login">
                  <button
                    onClick={() => {
                    localStorage.removeItem("Account");
                  }}
                  id="share"
                >
              Logout
            </button>
          </Link>
              </ul>
            </nav>
        <div className="container">
          <div className="row">
            <div class="jumbotron">
              <h2>Welcome to Enigma Share Section!</h2>
              <h5>You can Share your Confidential Files here</h5>
            </div>
          </div>
          <br></br>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <h4 className="card-header bg-primary text-white">
                  User Navigation
                </h4>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/" className="nav-link text-primary">
                      Home
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/dashboard" className="nav-link text-primary">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div id="share-desc">
              <div id="share-intro">
                Share Files Here
                <hr></hr>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-auto">
              <div id="share-box">
                <p>Select the recipient here</p>
                <select id="select-receiver">
                  <option value="address">Select the Receiver</option>
                </select>
                <div id="select-file">
                  <input id="choose" type="file" accept="application/pdf" name="fileUpload" />
                  <label for="choose" id="file-select">
                    <h6 id="before-add">Click the Icon below to select the file</h6>
                    <i
                      class="fas fa-file-medical fa-4x"
                      aria-hidden="true"
                      id="upload-icon"
                    ></i>
                    <i class="fas fa-file-upload fa-4x" id="file-added"></i>
                  </label>
                  <h5 id="after-add"></h5>
                  <img src="assets/loader-1.gif" alt="" id="loader" />
                  <h3 id="pw">
                    Please Wait, Your Transaction is being Processed
                  </h3>
                </div>
                <div id="upload-file">
                  <input
                    type="button"
                    value="Upload to IPFS"
                    id="upload"
                    name="upload-btn"
                  />
                  <label for="upload">
                    <span id="share-btn">Share</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Share;














