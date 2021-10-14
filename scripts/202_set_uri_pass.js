const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("SoulPass",accounts[0])
	
	await lssContract.setBaseURI('ipfs://QmQSoGeRSNXoS2Fbv9TuydrZUdU2tUpELimJprb613qQEt/');
})();