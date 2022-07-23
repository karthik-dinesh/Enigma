var SecureShare = artifacts.require("./SecureShare.sol");

module.exports = function(deployer) {
  deployer.deploy(SecureShare);
};
