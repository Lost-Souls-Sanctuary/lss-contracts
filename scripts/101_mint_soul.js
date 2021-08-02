const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("CCCRinkeby",accounts[0])
	let res = await lssContract.saveLostSoul(1).sendTransaction(
		{
			value: '0030000000000000000'
		});
	console.log(res)
})();