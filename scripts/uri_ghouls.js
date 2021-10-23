const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("Ghoul",accounts[0])
	
	await lssContract.setBaseURI('http://lostsoulsnft.com/api/ghouls/');
})();