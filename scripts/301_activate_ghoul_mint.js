const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let ghoulContract = await ethers.getContract("Ghoul",accounts[0])
	let res = await ghoulContract.pause(false,{
		/*gasPrice:ethers.utils.parseUnits('15','wei')*/
	});
	console.log(res)
})();