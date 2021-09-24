const {ethers } = require("hardhat");
const fs = require('fs').promises;

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("LostSoulsSanctuary",accounts[0])
	let res = [];
	// write to file
	for(let i=0; i<9999;i++){
		let resOut = await lssContract.ownerOf(i,{
		});
		console.log(i)
		res.push(resOut);
	}
	let jsonOutRes = await fs.writeFile("./snapshots/09_22_21_10_40_lss_snapshot.json",JSON.stringify(res,null,2))
	//console.log(res)
})();