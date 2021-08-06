import { ethers } from "hardhat";
import chai from 'chai';
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumber,Contract,ContractFactory } from "ethers";
chai.use(solidity);
const { expect } = chai;
describe("LostSoulsNFT", function () {
  let glu: SignerWithAddress;
  let gbk: SignerWithAddress;
  let ci: SignerWithAddress;
  let c: SignerWithAddress;
  let other: SignerWithAddress;
  let other2: SignerWithAddress;
  let community: SignerWithAddress;
  let lssNFT: ContractFactory;
  let lss: Contract;
  let initUrl = 'https://urlofjson.com/';

  before(async function () {
    [glu, gbk, ci, c,other,community,other2] = await ethers.getSigners();
    lssNFT = await ethers.getContractFactory("CCCRinkeby")
  })

  beforeEach(async function () {
    let args = [
    c.address,
    gbk.address,
    ci.address,
    other2.address,
    community.address,
    ];
    lss = await lssNFT.deploy(...args)
    await lss.deployed()
    await lss.setBaseURI(initUrl)
  })

  it("should have correct name and symbol and decimal", async function () {
    const name = await lss.name();
    const symbol = await lss.symbol();
    const pausedState = await lss.salePaused()
    expect(name, "CCCRinkeby");
    expect(symbol, "CCCR");
    expect(pausedState).to.be.equal(true);

  });

  it("should mint one, check baseURI and change baseURI", async function () {
    let tokenNum = 1;
    let tokenUrlNum = 0;

    // unpause sale
    await lss.pause(false);

    // mint one 
    await lss.saveLostSoul(tokenNum, {'value':ethers.utils.parseUnits("0.03","ether")})
    const url = await lss.tokenURI(tokenUrlNum);
    expect(url,initUrl+tokenUrlNum);
    const changeUrl = 'https://newurl.com/';
    await lss.setBaseURI(changeUrl);
    const newUrl = await lss.tokenURI(tokenUrlNum);
    expect(newUrl,changeUrl+tokenUrlNum);

  });

  it("should set Provenance Hash", async function () {
    let provenanceHash = '123456789ABC'
    let provenance = await lss.SOUL_PROVENANCE();
    expect('',provenance)

    let ph = await lss.setProvenanceHash(provenanceHash)
    expect(provenanceHash,ph)

  });

  it("should set pause state", async function () {
    // switch from true to false to start sale
    await lss.pause(false);
    const pausedState = await lss.salePaused();
    expect(pausedState).to.be.equal(false);
  });

  it("should return token of owner", async function () {
    // mint 1 to glu
    await lss.pause(false)
    await lss.saveLostSoul(1, {'value':ethers.utils.parseUnits("0.03","ether")})
    let tokenIds = await lss.walletOfOwner(glu.address);
    expect('0').to.be.equal(tokenIds.toString())

    //  mint second one
    await lss.saveLostSoul(1, {'value':ethers.utils.parseUnits("0.03","ether")})
    let tokenIds2 = await lss.walletOfOwner(glu.address);
    //console.log(tokenIds2.toString())
    let res = '0' +',' + '1';
    expect(res).to.be.equal(tokenIds2.toString())

  });

  it("should mint Reserve Souls", async function () {
    await lss.pause(false)
    await lss.reserveSouls(glu.address,100, {gasLimit:'11495542'})
    let tokenIds = await lss.walletOfOwner(glu.address);
    // mint 1 = 108692
    // mint 100 = 11551441
    //let gas = await lss.estimateGas.reserveSouls(glu.address,100,{gasLimit:'11551441'})
    //console.log(gas.toString())
    //console.log(tokenIds.toString())
    expect(tokenIds.toString())
    .to.be.equal('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99')
  });

  it("reserve estiamte gas", async function () {
    let estGas = '11495542';
    // mint 100 = 11551441
    let gas = await lss.estimateGas.reserveSouls(glu.address,100,{gasLimit:estGas})
    expect(gas.toString(),estGas);
  });

  it("should not mint more reserve souls than reserve amount", async function () {
    await lss.pause(false)
    await expect(lss.reserveSouls(glu.address,101, {gasLimit:'11604234'}))
    .to.be.revertedWith('Exceeds reserved Soul supply')
    let tokenIds = await lss.walletOfOwner(glu.address);

  });

  it("should not mint reserve souls if not owner", async function () {
    await lss.pause(false)
    await expect(lss.connect(other).reserveSouls(glu.address,10, {gasLimit:'11495542'}))
    .to.be.revertedWith("Ownable: caller is not the owner");
  });  


  it("should reject on less eth sent", async function () {
    await lss.pause(false)
    let price = 0.02;
    let amount = 20;
    let totalPrice = amount * price; // 0.6

    await expect(lss.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})).to.be.revertedWith('Ether sent is not correct')
  });

  it("should not mint more than 20 lost souls in one tx", async function () {
      await lss.pause(false)
      let price = 0.03;
      let amount = 21;
      let totalPrice = amount * price; // 0.6

      await expect(lss.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})).to.be.revertedWith('You can adopt a maximum of 20 Souls')
  });

  it("should fail mint if sale has not started", async function () {
      let price = 0.03;
      let amount = 20;
      let totalPrice = amount * price; // 0.6

      await expect(lss.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})).to.be.revertedWith('Sale paused');

  });

  it("should fail mint if all Souls have been minted", async function () {
    await lss.pause(false)
    let price = 0.03;
    let amount = 20;
    let totalPrice = amount * price; // 0.6

    await lss.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")});
    //let tokenIds = await lss.walletOfOwner(other.address);
  });

  it("should change price", async function () {
    await lss.pause(false)
      let newPrice = 0.05;
      let oldPrice = 0.03;
      let amount = 1;

      await lss.setPrice(ethers.utils.parseUnits(newPrice.toString(),'ether'))
      await lss.saveLostSoul(amount,{'value':ethers.utils.parseUnits(newPrice.toString(),"ether")});
      let tokenIds = await lss.walletOfOwner(glu.address);
      expect(tokenIds.toString()).to.be.equal('0');

      // Should fail
      await expect(lss.saveLostSoul(amount,{'value':ethers.utils.parseUnits(oldPrice.toString(),"ether")})).to.be.revertedWith("Ether sent is not correct");
  });

  it("should allow ether withdraw", async function () {
    // mint 99,999 to glu
    await lss.pause(false)
    let price = 0.03;
    let amount = 20;
    let totalPrice = amount * price; // 0.6

    // wallet before
    let t1b = await ethers.provider.getBalance(c.address);
    let t2b = await ethers.provider.getBalance(gbk.address);
    let t3b = await ethers.provider.getBalance(ci.address);
    let t4b = await ethers.provider.getBalance(other2.address);
    let t5b = await ethers.provider.getBalance(community.address);    
    let t1bres = await ethers.utils.formatEther(t1b);
    let res1b = parseFloat(t1bres)  + (4 / 100) * totalPrice;
    let t2bres = await ethers.utils.formatEther(t2b);
    let res2b = parseFloat(t2bres)  + (3 / 100) * totalPrice;
    let t3bres = await ethers.utils.formatEther(t3b);
    let res3b = parseFloat(t3bres)  + (10 / 100) * totalPrice;
    let t4bres = await ethers.utils.formatEther(t4b);
    let res4b = parseFloat(t4bres)  + (10 / 100) * totalPrice;
    let t5bres = await ethers.utils.formatEther(t5b);
    let res5b = parseFloat(t5bres)  + (73 / 100) * totalPrice;

    await lss.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")});
    //let tokenIds = await lss.walletOfOwner(other.address);
    await lss.withdrawAll();

    let t1a = await ethers.provider.getBalance(c.address);
    let t2a = await ethers.provider.getBalance(gbk.address);
    let t3a = await ethers.provider.getBalance(ci.address);
    let t4a = await ethers.provider.getBalance(other2.address);
    let t5a = await ethers.provider.getBalance(community.address);
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
    //console.log(res1)
    /*console.log(res1)
    console.log(res2)
    console.log(res3)
    console.log(res4)
    console.log(res5)*/

    expect(res1b).to.be.equal(res1)
    expect(res2b).to.be.equal(res2)
    expect(res3b).to.be.equal(res3)
    expect(res4b).to.be.equal(res4)
    expect(res5b).to.be.equal(res5)
  });

  
})
