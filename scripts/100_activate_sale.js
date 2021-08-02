const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("CCCRinkeby",accounts[0])
	let res = await lssContract.connect(accounts[0]).flipSaleState();
	console.log(res)
})();