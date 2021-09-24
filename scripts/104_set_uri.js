const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("LostSoulsSanctuary",accounts[0])
	
	await lssContract.setBaseURI('https://lostsoulsnft.com/api/');
})();