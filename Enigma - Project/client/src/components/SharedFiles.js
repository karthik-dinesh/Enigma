import React, { Component } from "react";
import { Link } from "react-router-dom";
import SecureShareContract from "../contracts/SecureShare.json";
import getWeb3 from "../getWeb3";
import Swal from "sweetalert2";
import "../styles/SharedFiles.css";

const refreshWindow = () => {
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  }
};
class SharedFiles extends Component {
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
    var status;
    var fileId;
    var senderName;
    var sharedFiles = document.getElementById("shared-files");

    const { accounts, contract } = this.state;
    contract.methods
      .getFileId(accounts[0])
      .call()
      .then((val) => {
        var ipfsSite = "http://ipfs.io/ipfs/";
        fileId = val;

        for (let index = 0; index < fileId; index++) {
          contract.methods
            .getFile(index, accounts[0])
            .call()
            .then((res) => {
              contract
                .getPastEvents("AddedUser", {
                  fromBlock: 0,
                  toBlock: "latest",
                })
                .then((val) => {
                  console.log("Value", val);
                  console.log("Result", res);
                  var size = val.length;

                  for (var index = 0; index < size; index++) {
                    var name = val[index].returnValues.name;
                    var address = val[index].returnValues.accountAddress;
                    var senderNameAddress = res[2];

                    if (senderNameAddress == address) {
                      senderName = name;
                    }
                  }
                  if (res[5] == "0") {
                    status = "Not Verified";
                  } else if (res[5] == "1") {
                    status = "Verified";
                  }

                  sharedFiles.innerHTML +=
                           `<div class="course">
                              <h2>${res[1]} <i class="fas fa-file-download"></i></h2>
                              <hr />
                              <h6 >Sender: ${senderName}</h6>
                              <h6>Address: ${res[2]}</h6>
                              <h6>Status: ${status}</h6>
                              <h6>Time Stamp: ${res[4]}</h6>
                              <hr></hr>
                                <div id="buttonlayout">
                                  <div>
                                    <a href=${ipfsSite + res[0]}>
                                      <button class="btn">View Report</button>
                                    </a>
                                  </div>
                                  <div>
                                    <a href="#">
                                      <button class="btn">Verify</button>
                                    </a>
                                  </div>
                                </div>
                            </div>
                            <hr></hr>`;
                });
            });
        }
      });
  };

  render() {
    if (!this.state.web3) {
      refreshWindow();
    }
    return (
      <div className="container">
        <div class="jumbotron">
          <h2>Welcome to Shared Files</h2>
          <h5>All the files that you have received appear here</h5>
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

                <li className="list-group-item">
                  <Link to="/share" className="nav-link text-primary">
                    Share Files
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link to="/sharedfiles" className="nav-link text-primary">
                    View Shared Files
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12">
            <h3 id="dash-head">Files Shared with You</h3>
            <hr></hr>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-auto">
                  <div id="shared-files">
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SharedFiles;
