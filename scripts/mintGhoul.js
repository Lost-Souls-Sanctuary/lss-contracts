// un pause souls sale
// un pause soul pass
// unpase ghouls
// mint souls
// mint soul pass
// mint ghouls

const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("LostSoulsSanctuary",accounts[0])
	//let res = await lssContract.pause(false);

	let soulPassContract = await ethers.getContract("SoulPass",accounts[0])
	//let res2 = await soulPassContract.pause(false);

	let ghoulContract = await ethers.getContract("Ghoul",accounts[0])
	let res3 = await ghoulContract.pause(false);

	// save souls
	//console.log(ethers.utils.parseUnits("0.03",18).toString())
	const tx = {
		'value':ethers.utils.parseUnits("0.06",'ether')
	};
	await ghoulContract.claimGhoul(0);
	let res4 = await ghoulContract.walletOfOwner(accounts[0].address);


	//console.log(res)
})();