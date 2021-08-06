const {ethers } = require("hardhat");

(async () =>  {
  const { deploy } = deployments

	let accounts = await ethers.getSigners();
	let lssContract = await ethers.getContract("CCCRinkeby",accounts[0])
	
	await lssContract.setBaseURI('ipfs://QmaRUD43vdEWQ59szPCx3wkWhGV3DZWT1JcuC4s3Lq65Ug/');
})();