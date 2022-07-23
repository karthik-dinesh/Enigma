// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.4;

contract SecureShare {

uint fileId=0;

struct UserInfo{
  string name;
  string password;
  address accountAddress;
  string accountType;
}

enum State{
  NotVerified,
  Verified
}

struct SharedData{
    
    string storedHash;
    string fileName;
    address sender;
    address receiver;
    string time;
    State choice;
   
}
State public choice =State.NotVerified;

event AddedUser(
  string name,
  string password,
  address accountAddress,
  string accountType
);


  event ShareFile(
    string ipfsValue,
    string fileName,
    address sender,
    address receiver,
    string time,
    State choice
  );


event Success(
  bool value
);

event Fail(
  bool value
);

  mapping(string => UserInfo) UserNameMapping;

  mapping(address => mapping(uint => SharedData))  SharedDataMapping;
 

  mapping(address=>uint) fileKey;

  

  function registerUser(string memory name,string memory password,address accountAddress,string memory accountType) public{
    UserNameMapping[name].name = name;
    UserNameMapping[name].password = password;
    UserNameMapping[name].accountAddress = accountAddress;
    UserNameMapping[name].accountType=accountType;
    emit AddedUser(name, password, accountAddress, accountType);
  }

  function uploadHash(string memory storedHash,string memory fileName,address sender,address receiver,string memory time) public {
     
    fileId=fileKey[receiver]; 
    SharedDataMapping[receiver][fileId] = SharedData(storedHash,fileName,msg.sender,receiver,time,choice);
    
    fileKey[receiver]+=1;
    
    emit ShareFile(storedHash,fileName,sender,receiver,time,choice);
    
  }
  
  function getFile(uint fId,address receiver) public view returns(string memory,string memory,address,address,string memory,State choice){
      return (SharedDataMapping[receiver][fId].storedHash,SharedDataMapping[receiver][fId].fileName,
      SharedDataMapping[receiver][fId].sender,SharedDataMapping[receiver][fId].receiver,SharedDataMapping[receiver][fId].time,SharedDataMapping[receiver][fId].choice);
  }
  
  function getFileId(address receiver) public view returns(uint){
    return fileKey[receiver];
  }
 
  function verifyState(uint fId, address receiver) public {
    SharedDataMapping[receiver][fId].choice=State.Verified;
  }

   function getFile2(uint fId,address receiver) public view returns(string memory,string memory,address,address,string memory,State choice){
      if(SharedDataMapping[receiver][fId].choice==State.NotVerified)
      {
      return (SharedDataMapping[receiver][fId].storedHash,SharedDataMapping[receiver][fId].fileName,
      SharedDataMapping[receiver][fId].sender,SharedDataMapping[receiver][fId].receiver,SharedDataMapping[receiver][fId].time,SharedDataMapping[receiver][fId].choice);
  }
  }

  function  authenticateUser(string memory user,string memory password) public {
    if( (keccak256(abi.encodePacked(msg.sender))) == (keccak256(abi.encodePacked(UserNameMapping[user].accountAddress)))){
      emit Success(true);
    }
    else{
      emit Success(false);
    }
  }

}
