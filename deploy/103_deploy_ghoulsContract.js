module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  let accounts = await ethers.getSigners();
  //const SoulPassContract = await deployments.get("SoulPass");
  let args = ['0x6e3Ef4d5102a34e6D3d35375Fa37480d605ebDaf'];
  await deploy("Ghoul", {
    from: accounts[0].address,
    args:args,
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["Ghoul"]