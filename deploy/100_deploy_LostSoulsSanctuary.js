module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  let accounts = await ethers.getSigners();
  let args = [
    '0xF4dEc5f15378A92089cE04226061782DEdC3Aab1',// C
    '0x2cDf899777C11A24cB4d69de8cb7ad304Db95F83',// GBK
    '0x102a37308cEBC21b87101D6abCF47Bb99193BC31',// CI
    '0xC5182f36001eB7CBaBdb687087596CC42AfCB605', // GLU
    '0xFfCd5e359A6AFe39f6c58544db0BB408F2d17e33', // MSIG
  ];
  await deploy("LostSoulsSanctuary", {
    from: accounts[0].address,
    args:args,
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["LostSoulsSanctuary"]