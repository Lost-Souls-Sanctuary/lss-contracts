module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  let accounts = await ethers.getSigners();

  await deploy("LostSoulsSanctuary", {
    from: accounts[0].address,
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["LostSoulsSanctuary"]