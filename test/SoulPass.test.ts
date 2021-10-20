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
  let initUrl = 'https://urlofjson.com/';

  before(async function () {
    [glu, gbk, ci, c,other,community,other2] = await ethers.getSigners();
    soulPass = await ethers.getContractFactory("SoulPass");
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
    await sp.deployed()
    await sp.setBaseURI(initUrl)
  })

  it("should have correct name and symbol and decimal", async function () {
    const name = await sp.name();
    const symbol = await sp.symbol();
    const pausedState = await sp.mintPaused();
    expect(name, "SoulPass");
    expect(symbol, "SP");
    expect(pausedState).to.be.equal(true);

  });

  it("should mint one soul pass", async function () {
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

  });

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

  /*it("reserve estiamte gas", async function () {
    let estGas = '14430226';
    // mint 100 = 11551441
    let gas = await sp.estimateGas.reserveSouls(glu.address,62,{gasLimit:estGas})
    console.log(gas.toString())
    expect(gas.toString(),estGas);
  });*/

  /*it("should mint Reserve Souls 1", async function () {
    await sp.pause(false)
    let price = 0.03;
    let amount = 8;
    let totalPrice = amount * price; // 0.6
    //await sp.reserveSouls(glu.address,2, {gasLimit:'12450000'})
    await sp.reserveSouls(gbk.address,3)
    await sp.saveLostSoul(8, {'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})
    let tokenIds = await sp.walletOfOwner(glu.address);
    // mint 1 = 108692
    // mint 100 = 11551441
    //let gas = await sp.estimateGas.reserveSouls(glu.address,100,{gasLimit:'11495542'})
    //console.log(gas.toString())
    //console.log(tokenIds.toString())
    expect(tokenIds.toString())
    .to.be.equal('0,1,2,3,4,5,6,7');//,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124')
  });*/


  /*it("should mint Reserve Souls", async function () {
    await sp.pause(false)
    await sp.reserveSouls(glu.address,62, {gasLimit:'12450000'})
    await sp.reserveSouls(glu.address,63, {gasLimit:'12450000'})
    let tokenIds = await sp.walletOfOwner(glu.address);
    // mint 1 = 108692
    // mint 100 = 11551441
    //let gas = await sp.estimateGas.reserveSouls(glu.address,100,{gasLimit:'11495542'})
    //console.log(gas.toString())
    //console.log(tokenIds.toString())
    expect(tokenIds.toString())
    .to.be.equal('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124')
  });*/


  /*it("should not mint more reserve souls than reserve amount", async function () {
    await sp.pause(false)
    await sp.reserveSouls(glu.address,62, {gasLimit:'12450000'})
    await sp.reserveSouls(glu.address,63, {gasLimit:'12450000'})
    await expect(sp.reserveSouls(glu.address,1, {gasLimit:'12450000'}))
    .to.be.revertedWith('Exceeds reserved Soul supply')
    let tokenIds = await sp.walletOfOwner(glu.address);

  });*/

  /*it("should not mint reserve souls if not owner", async function () {
    await sp.pause(false)
    await expect(sp.connect(other).reserveSouls(glu.address,10, {gasLimit:'11495542'}))
    .to.be.revertedWith("Ownable: caller is not the owner");
  });  


  it("should reject on less eth sent", async function () {
    await sp.pause(false)
    let price = 0.02;
    let amount = 20;
    let totalPrice = amount * price; // 0.6

    await expect(sp.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})).to.be.revertedWith('Ether sent is not correct')
  });

  it("should not mint more than 20 lost souls in one tx", async function () {
      await sp.pause(false)
      let price = 0.03;
      let amount = 21;
      let totalPrice = amount * price; // 0.6

      await expect(sp.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})).to.be.revertedWith('You can adopt a maximum of 20 Souls')
  });

  it("should fail mint if sale has not started", async function () {
      let price = 0.03;
      let amount = 20;
      let totalPrice = amount * price; // 0.6

      await expect(sp.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")})).to.be.revertedWith('Sale paused');

  });

  it("should fail mint if all Souls have been minted", async function () {
    await sp.pause(false)
    let price = 0.03;
    let amount = 20;
    let totalPrice = amount * price; // 0.6

    await sp.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")});
    //let tokenIds = await sp.walletOfOwner(other.address);
  });

  it("should change price", async function () {
    await sp.pause(false)
      let newPrice = 0.05;
      let oldPrice = 0.03;
      let amount = 1;

      await sp.setPrice(ethers.utils.parseUnits(newPrice.toString(),'ether'))
      await sp.saveLostSoul(amount,{'value':ethers.utils.parseUnits(newPrice.toString(),"ether")});
      let tokenIds = await sp.walletOfOwner(glu.address);
      expect(tokenIds.toString()).to.be.equal('0');

      // Should fail
      await expect(sp.saveLostSoul(amount,{'value':ethers.utils.parseUnits(oldPrice.toString(),"ether")})).to.be.revertedWith("Ether sent is not correct");
  });

  it("should only allow owner to withdrawAll", async function () {
    await sp.pause(false)
      let newPrice = 0.05;
      let oldPrice = 0.03;
      let amount = 1;

      //await sp.setPrice(ethers.utils.parseUnits(newPrice.toString(),'ether'))
      await sp.saveLostSoul(amount,{'value':ethers.utils.parseUnits(newPrice.toString(),"ether")});

      // Should fail
      await expect(sp.connect(gbk).withdrawAll()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should allow ether withdraw", async function () {
    // mint 99,999 to glu
    await sp.pause(false)
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
    let res1b = parseFloat(t1bres)  + (8 / 100) * totalPrice;
    let t2bres = await ethers.utils.formatEther(t2b);
    let res2b = parseFloat(t2bres)  + (6 / 100) * totalPrice;
    let t3bres = await ethers.utils.formatEther(t3b);
    let res3b = parseFloat(t3bres)  + (18 / 100) * totalPrice;
    let t4bres = await ethers.utils.formatEther(t4b);
    let res4b = parseFloat(t4bres)  + (18 / 100) * totalPrice;
    let t5bres = await ethers.utils.formatEther(t5b);
    let res5b = parseFloat(t5bres)  + (50 / 100) * totalPrice;

    await sp.connect(other).saveLostSoul(amount,{'value':ethers.utils.parseUnits(totalPrice.toString(),"ether")});
    //let tokenIds = await sp.walletOfOwner(other.address);
    await sp.withdrawAll();

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
    console.log(res5)

    expect(res1b).to.be.equal(res1)
    expect(res2b).to.be.equal(res2)
    expect(res3b).to.be.equal(res3)
    expect(res4b).to.be.equal(res4)
    expect(res5b).to.be.equal(res5)
  });*/

  
})
