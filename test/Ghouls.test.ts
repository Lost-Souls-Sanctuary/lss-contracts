import { ethers } from "hardhat";
import chai from 'chai';
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumber,Contract,ContractFactory } from "ethers";
chai.use(solidity);
const { expect } = chai;
describe("SoulPass", function () {
  let glu: SignerWithAddress;
  let gbk: SignerWithAddress;
  let ci: SignerWithAddress;
  let c: SignerWithAddress;
  let other: SignerWithAddress;
  let other2: SignerWithAddress;
  let community: SignerWithAddress;

  // Soul Pass Contract
  let soulPass: ContractFactory;
  let sp: Contract;

  // LSS Contract
  let lssNFT: ContractFactory;
  let lss: Contract;

  // Ghoul Contract
  let ghoul: ContractFactory;
  let gh: Contract;
  let initUrl = 'https://urlofjson.com/';

  before(async function () {
    [glu, gbk, ci, c,other,community,other2] = await ethers.getSigners();
    soulPass = await ethers.getContractFactory("SoulPass");
    ghoul = await ethers.getContractFactory("Ghoul");
    lssNFT = await ethers.getContractFactory("LostSoulsSanctuary");
  })

  beforeEach(async function () {
    // Deploy LSS
    let args = [
    c.address,
    gbk.address,
    ci.address,
    other2.address,
    community.address,
    ];
    lss = await lssNFT.deploy(...args)
    let lssContractOut = await lss.deployed()
    //console.log(lssContractOut.address);

    // Deploy Soul Pass
    let args1 = [
    lssContractOut.address,
    ];
    sp = await soulPass.deploy(...args1)
    //console.log(sp)
    let spContractOut = await sp.deployed()
    await sp.setBaseURI(initUrl)

    // Deploy Ghoul
    let args2 = [
    spContractOut.address,
    ];
    gh = await ghoul.deploy(...args1)
    //console.log(sp)
    await gh.deployed()
    await gh.setBaseURI(initUrl)

  })

  it("should have correct name and symbol and decimal", async function () {
    const name = await sp.name();
    const symbol = await sp.symbol();
    const pausedState = await sp.mintPaused();
    expect(name, "Ghouls");
    expect(symbol, "GHLS");
    expect(pausedState).to.be.equal(true);

  });

  it("should set not mint after time is up", async function () {
    let sle = await this.speedlimit.speedLimitEnd();
    let twoWeeks = 604800 * 2;
    const { timestamp } = await ethers.provider.getBlock("latest");
    expect(sle).to.be.equal(timestamp + twoWeeks);
    
    let sl = await this.speedlimit.speedLimit();
    expect(sl).to.be.equal(toUnit(1000));
  });

  it("should extend speed limit", async function () {
    let oneMoreWeek = 604800;
    let twoWeeks = 604800 * 2;
    await this.speedlimit.extendSpeedLimit(oneMoreWeek);

    let sle = await this.speedlimit.speedLimitEnd();
    const { timestamp } = await ethers.provider.getBlock("latest");
    expect(sle).to.be.equal(timestamp + twoWeeks + oneMoreWeek - 1);
  });
  /*it("should mint one soul pass", async function () {
    let price = 0.03;
    let amount = 2;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint two
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    await sp.claimSoulPass(0,1);

    // Check if soulpasses were minted to glu
    let tokenIds = await sp.walletOfOwner(glu.address);
    //console.log(tokenIds.toString())
    expect('0').to.be.equal(tokenIds.toString());

  });*/

/*it("should mint max soul pass", async function () {
    let price = 0.03;
    let amount = 8;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint two
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    //await sp.claimSoulPass(0,1);
    //await sp.claimSoulPass(2,3);
    await expect(sp.claimAllSoulPass([0,1,2,3]))
      .to.be.revertedWith("Exceeds maximum SoulPass supply");
    // Check if soulpasses were minted to glu
    let tokenIds = await sp.walletOfOwner(glu.address);
    //console.log(tokenIds.toString())
    //expect('0,1').to.be.equal(tokenIds.toString());

    // Mint third one
    //await expect(sp.claimSoulPass(4,5))
    //.to.be.revertedWith("Exceeds maximum SoulPass supply");


  });*/

  it("should mint one soul pass and check soulclaimed", async function () {
    let price = 0.03;
    let amount = 2;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint two
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    await sp.claimSoulPass(0,1);

    // Check if soulpasses were minted to glu
    let tokenIds = await sp.walletOfOwner(glu.address);
    //console.log(tokenIds.toString())
    expect('0').to.be.equal(tokenIds.toString());

    // Check if tokenIds were saved in soulClaimed
    let tokenOneClaimedStatus = await sp.soulClaimed(0);
    expect(true).to.be.equal(tokenOneClaimedStatus);
    let tokenTwoClaimedStatus = await sp.soulClaimed(1);
    expect(true).to.be.equal(tokenTwoClaimedStatus);

  });



  it("should not mint soulpass - you don't own the first one", async function () {
    let price = 0.03;
    let amount = 2;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint two
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})
    // mint third one to other account
    await lss.connect(gbk).saveLostSoul(1, {'value':ethers.utils.parseUnits(price.toString(),"ether")})


    // Mint SP
    await expect(sp.claimSoulPass(2,1))
    .to.be.revertedWith("You do not own soul one");

  });

  it("should not mint soulpass - you don't own the second one", async function () {
    let price = 0.03;
    let amount = 2;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint two
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})
    // mint third one to other account
    await lss.connect(gbk).saveLostSoul(1, {'value':ethers.utils.parseUnits(price.toString(),"ether")})


    // Mint SP
    await expect(sp.claimSoulPass(1,2))
    .to.be.revertedWith("You do not own soul two");
  });

  /*it("should set Provenance Hash", async function () {
    let provenanceHash = '123456789ABC'
    let provenance = await sp.SOUL_PROVENANCE();
    expect('',provenance)

    let ph = await sp.setProvenanceHash(provenanceHash)
    expect(provenanceHash,ph)

  });*/

  it("should throw error on first soul already claimed", async function () {
    let price = 0.03;
    let amount = 2;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint two
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    await sp.claimSoulPass(0,1);

    // Check if soulpasses were minted to glu
    let tokenIds = await sp.walletOfOwner(glu.address);
    //console.log(tokenIds.toString())
    expect('0').to.be.equal(tokenIds.toString());

    // Check if tokenIds were saved in soulClaimed
    let tokenOneClaimedStatus = await sp.soulClaimed(0);
    expect(true).to.be.equal(tokenOneClaimedStatus);
    let tokenTwoClaimedStatus = await sp.soulClaimed(1);
    expect(true).to.be.equal(tokenTwoClaimedStatus);

    await expect(sp.claimSoulPass(0,1)).to.be.revertedWith("Soul one already claimed")



    });

  it("should throw error on second soul already claimed", async function () {
    let price = 0.03;
    let amount = 3;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint two
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    await sp.claimSoulPass(0,1);

    // Check if soulpasses were minted to glu
    let tokenIds = await sp.walletOfOwner(glu.address);
    //console.log(tokenIds.toString())
    expect('0').to.be.equal(tokenIds.toString());

    // Check if tokenIds were saved in soulClaimed
    let tokenOneClaimedStatus = await sp.soulClaimed(0);
    expect(true).to.be.equal(tokenOneClaimedStatus);
    let tokenTwoClaimedStatus = await sp.soulClaimed(1);
    expect(true).to.be.equal(tokenTwoClaimedStatus);

    await expect(sp.claimSoulPass(2,1)).to.be.revertedWith("Soul two already claimed")

    });

  it("should set pause state", async function () {
    // switch from true to false to start sale
    await sp.pause(false);
    const pausedState = await sp.mintPaused();
    expect(pausedState).to.be.equal(false);
  });

  it("should mint two soul passes claimAllSoulPass", async function () {
    let price = 0.03;
    let amount = 4;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint four
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    await sp.claimAllSoulPass([0,1,2,3]);

    // Check if soulpasses were minted to glu
    let tokenIds = await sp.walletOfOwner(glu.address);
    //console.log(tokenIds.toString())
    expect('0,1').to.be.equal(tokenIds.toString());

    // Check if tokenIds were saved in soulClaimed
    let tokenOneClaimedStatus = await sp.soulClaimed(0);
    expect(true).to.be.equal(tokenOneClaimedStatus);
    let tokenTwoClaimedStatus = await sp.soulClaimed(1);
    expect(true).to.be.equal(tokenTwoClaimedStatus);
    let tokenThreeClaimedStatus = await sp.soulClaimed(2);
    expect(true).to.be.equal(tokenThreeClaimedStatus);
    let tokenFourClaimedStatus = await sp.soulClaimed(3);
    expect(true).to.be.equal(tokenFourClaimedStatus);

  });

  it("should throw error on claimAllSoulPass entered amount is odd", async function () {
    let price = 0.03;
    let amount = 4;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint four
    await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    await expect(sp.claimAllSoulPass([0,1,2])).to.be.revertedWith("Send an even amount of Souls");

    
  });

  it("should throw error on claimAllSoulPass entered amount is odd", async function () {
    let price = 0.03;
    let amount = 4;
    let totalPrice = amount * price; // 0.6

    // unpause sale for both
    await lss.pause(false);
    await sp.pause(false);

    // mint four
    //await lss.saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})
    await lss.connect(gbk).saveLostSoul(amount, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})


    // Mint SP
    await expect(sp.claimAllSoulPass([])).to.be.revertedWith("Send an even amount of Souls");

    
  });

  it("should return token of owner", async function () {
    // mint 1 to glu
    /*await sp.pause(false)
    await sp.saveLostSoul(1, {'value':ethers.utils.parseUnits("0.03","ether")})
    let tokenIds = await sp.walletOfOwner(glu.address);
    expect('0').to.be.equal(tokenIds.toString())

    //  mint second one
    await sp.saveLostSoul(1, {'value':ethers.utils.parseUnits("0.03","ether")})
    let tokenIds2 = await sp.walletOfOwner(glu.address);
    //console.log(tokenIds2.toString())
    let res = '0' +',' + '1';
    expect(res).to.be.equal(tokenIds2.toString())*/

  });
  
})
