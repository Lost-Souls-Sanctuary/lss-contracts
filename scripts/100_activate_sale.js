const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("LostSoulsSanctuary",accounts[0])
	let res = await lssContract.pause(false,{
		/*gasPrice:ethers.utils.parseUnits('15','wei')*/
	});
	console.log(res)
})();