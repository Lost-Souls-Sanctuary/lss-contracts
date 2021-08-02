module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  let accounts = await ethers.getSigners();

  await deploy("CCCRinkeby", {
    from: accounts[0].address,
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["CCCRinkeby"]