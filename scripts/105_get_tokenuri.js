const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("CCCRinkeby",accounts[0])
	
	let res = await lssContract.tokenURI(0);
	console.log(res)
})();