import React, { useState, Component, useEffect } from "react";
import { Link } from "react-router-dom";
import SecureShareContract from "../contracts/SecureShare.json";
import getWeb3 from "../getWeb3";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";
import { Fragment } from "react";

export default function ViewSharedFiles() {
  const [reports, setReports] = useState([]);
  const [account, setaccounts] = useState(null);
  const [contract, setcontract] = useState(null);
  const [web3, setweb3] = useState(null);
  const [renderac, setRenderac] = useState(null);
  const [storageValue, setstorageValue] = useState(0);
  var sreports = [];
  var currentactype;
  //Fetch address from doctor
  var dtaccount;
  var actype;

  useEffect(() => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    LoadWeb3();
  });



  const LoadWeb3 = async () => {
    try {
      
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SecureShareContract.networks[networkId];
      const contract = new web3.eth.Contract(
        SecureShareContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      var currentUserName;

      var fileId;
      var senderName;
      var accountofSender;
      var accountofReceiver;
      var status;
      var dbName = document.getElementById("db-name");
      var accountDet = document.getElementById("account");

      contract
        .getPastEvents("AddedUser", {
          fromBlock: 0,
          toBlock: "latest",
        })
        .then((val) => {
          var size = val.length;

          Swal.fire({
            title: "Please Wait, Your Transactions are getting loaded 🕝",
            showConfirmButton: false,
            icon: "info",
            timer: 2500,
          });

          for (var index = 0; index < size; index++) {
            var name = val[index].returnValues.name;
            var address = val[index].returnValues.accountAddress;
            currentactype = val[index].returnValues.accountType;

            console.log("Account Type", currentactype);

            if (accounts[0] == address) {
              dbName.innerHTML = `&nbsp${name}`;
              currentUserName = name;
              localStorage.setItem("Account", currentactype);
              //sessionStorage.setItem('acc',currentactype)
              accountDet.innerHTML = `&nbsp&nbsp${currentactype} Account`;
            }
          }
        });

      actype = localStorage.getItem("Account");
      setRenderac(actype);
      console.log("ACTYPE1", actype);
      console.log("ACTYPE2", renderac);

      //Doctor
      if (actype == "Doctor") {
        localStorage.setItem("DoctorAccount", accounts[0]);
        console.log("Accountsd", accounts[0]);
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
                      var size = val.length;

                      for (var index = 0; index < size; index++) {
                        var name = val[index].returnValues.name;
                        var address = val[index].returnValues.accountAddress;
                        var account = val[index].returnValues.accountType;
                        var senderNameAddress = res[2];
                        if (senderNameAddress == address) {
                          senderName = name;
                          accountofSender = account;
                          accountofReceiver = res[3];
                        }
                        if (res[5] == "0") {
                          res[5] = "Not Verified";
                          status = "Not Verified";
                        } else if (res[5] == "1") {
                          status = "Verified";
                          res[5] = "Verified";
                        }
                      }
                      let reportdata = {
                        ipfsvalue: res[0],
                        filename: res[1],
                        sender: res[2],
                        receiver: res[3],
                        timestamp: res[4],
                        status: res[5],
                      };
                      sreports.push(reportdata);
                      console.log("Sreports", sreports);

                    })
                    /*  Comment code */
                    .then(() => {
                      var verifyFile = document.getElementById("verify");
                      {
                        if (verifyFile) {
                          verifyFile.addEventListener("click", () => {
                            var fileName = document.getElementById("file-name")
                              .innerHTML;
                            console.log("Verify-fname", fileName);
                            console.log("Verify-index", index);
                            contract.methods
                              .verifyState(index, accountofReceiver)
                              .send({ from: accountofReceiver })
                              .then((data) => {
                                console.log("added data", data);
                                Swal.fire({
                                  icon: "success",
                                  title:
                                    "The Report has been Verified Successfully ✔️",
                                  showConfirmButton: false,
                                  timer: 4000,
                                });
                                window.location =
                                  "http://localhost:3000/dashboard";
                              });
                          });
                        }
                      }
                    });
                });
            }
          });
      }

      //Police Station Start
      if (actype == "Police Station") {
        dtaccount = localStorage.getItem("DoctorAccount");
        console.log("DT-AC", dtaccount);

        contract.methods
          .getFileId(dtaccount)
          .call()
          .then((val) => {
            var ipfsSite = "http://ipfs.io/ipfs/";
            fileId = val;

            for (let index = 0; index < fileId; index++) {
              contract.methods
                .getFile(index, dtaccount)
                .call()
                .then((res) => {
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
                        var account = val[index].returnValues.accountType;
                        var senderNameAddress = res[2];
                        if (senderNameAddress == address) {
                          senderName = name;
                          accountofSender = account;
                          accountofReceiver = res[3];
                        }
                        if (res[5] == "0") {
                          res[5] = "Not Verified";
                          status = "Not Verified";
                        } else if (res[5] == "1") {
                          status = "Verified";
                          res[5] = "Verified";
                        }
                      }
                      let reportdata = {
                        ipfsvalue: res[0],
                        filename: res[1],
                        sender: res[2],
                        receiver: res[3],
                        timestamp: res[4],
                        status: res[5],
                      };
                      sreports.push(reportdata);
                      console.log("Sreports", sreports);

              
                    });
                });
            }
          });
      }

      setReports(sreports);
      console.log("AAA", reports);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const DisplayReports = () => <h1>Hello World</h1>;

  return (
    <div>
      <nav id="nav-bar-db">
        <ul id="nav-items-db">
          <Link to="/">
            <li id="home">Home</li>
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
          <div className="jumbotron">
            <h2>Welcome to Enigma Dashboard!</h2>
            <h5>Fast and secure way of exchanging data</h5>
          </div>
        </div>
      </div>
      <br></br>
      <div className="container">
          <div className="row">
            <div className="col-sm-6 col-xs-12">
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
                  { renderac == "Pathology Lab" ? (
                  <div>
                      <li className="list-group-item">
                       <Link to="/share" className="nav-link text-primary">
                        Share Files
                      </Link>
                  </li>
                  </div>
                  ):(
                  <div>
                  </div>
                  )}
                  
                  { renderac != "Pathology Lab" ? (<div>
                    <li className="list-group-item">
                    <Link to="/sharedfiles" className="nav-link text-primary">
                      View Shared Files
                    </Link>
                  </li>
              </div>):
              (<div></div>)}
                </ul>
              </div>
            </div>
            <div className="col r2">
              <div className="card mb-4">
                <h4 className="card-header bg-secondary text-white">
                  User Information
                </h4>
                <ul className="list-group">
                  <li className="list-group-item  ">
                    <span className="mr-2">
                      Name : <span id="db-name"></span>
                    </span>
                  </li>
                  <li className="list-group-item">
                    <span className="mr-2">
                      A/C Type&nbsp; :{" "}
                    <span id="account">Your Account</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
