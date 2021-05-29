const ClavaCoin = artifacts.require('Clava.sol');

module.exports = function (deployer) {
  deployer.deploy(ClavaCoin);
};
