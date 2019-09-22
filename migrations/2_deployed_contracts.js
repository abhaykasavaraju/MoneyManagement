var MyContract = artifacts.require("./MyContract.sol");
var MM = artifacts.require("./MoneyManagement.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
  deployer.deploy(MM);
};
