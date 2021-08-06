const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("CCCRinkeby",accounts[0])
	let bal = await ethers.provider.getBalance(accounts[0].address)
	console.log(ethers.utils.formatEther(bal))
	let contractBal = await ethers.provider.getBalance(lssContract.address)
	console.log(ethers.utils.formatEther(contractBal))

	await lssContract.withdrawAll();

	let bal2 = await ethers.provider.getBalance(accounts[0].address)
	console.log(ethers.utils.formatEther(bal2))
	let contractBal2 = await ethers.provider.getBalance(lssContract.address)
	console.log(ethers.utils.formatEther(contractBal2))

	let t1a = await ethers.provider.getBalance(accounts[1].address);
	let t2a = await ethers.provider.getBalance(accounts[2].address);
	let t3a = await ethers.provider.getBalance(accounts[3].address);
	let t4a = await ethers.provider.getBalance(accounts[0].address);
	let t5a = await ethers.provider.getBalance(accounts[4].address);
	let t1res = await ethers.utils.formatEther(t1a);
	let res1 = parseFloat(t1res);
	let t2res = await ethers.utils.formatEther(t2a);
	let res2 = parseFloat(t2res);
	let t3res = await ethers.utils.formatEther(t3a);
	let res3 = parseFloat(t3res);
	let t4res = await ethers.utils.formatEther(t4a);
	let res4 = parseFloat(t4res);
	let t5res = await ethers.utils.formatEther(t5a);
	let res5 = parseFloat(t5res);

	console.log(res1)
  console.log(res2)
  console.log(res3)
  console.log(res4)
  console.log(res5)

})();