module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  let accounts = await ethers.getSigners();
  const LostSoulsContract = await deployments.get("LostSoulsSanctuary");
  let args = [LostSoulsContract.address];
  await deploy("SoulPass", {
    from: accounts[0].address,
    args:args,
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["SoulPass"]