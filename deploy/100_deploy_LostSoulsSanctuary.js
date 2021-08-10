module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  let accounts = await ethers.getSigners();
  let args = [
    accounts[1].address,
    accounts[2].address,
    accounts[3].address,
    accounts[0].address,
    '0x4c14a6C2EEC00f0b9474a43BCfd58Fa70D3A9e60',
  ];
  await deploy("CCCRinkeby", {
    from: accounts[0].address,
    args:args,
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["CCCRinkeby"]