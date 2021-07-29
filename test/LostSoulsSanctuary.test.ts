import { ethers } from "hardhat";
import {expect, use} from 'chai';
import { solidity } from "ethereum-waffle";

use(solidity);

describe("LostSoulsNFT", function () {
  before(async function () {
    this.LssNFT = await ethers.getContractFactory("LostSoulsSanctuary")
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
    this.mrminter = this.signers[3]
  })

  beforeEach(async function () {
    this.lss = await this.LssNFT.deploy()
    await this.lss.deployed()
  })

  it("should have correct name and symbol and decimal", async function () {
    const name = await this.lss.name()
    const symbol = await this.lss.symbol()
    expect(name, "LostSoulsSanctuary")
    expect(symbol, "LSS")
  });

  it("should allow ether withdraw", async function () {

  });

  it("should set Base URI", async function () {

  });

  it("should set Provenance Hash", async function () {

  });

  it("should flip sale state", async function () {

  });

  it("should mint Reserve Souls", async function () {

  });

  it("should return token of owner", async function () {

  });

  it("should return the license", async function () {

  });

  it("should lock the license", async function () {

  });

  it("should change the license", async function () {

  });

  it("should mint LostSoul", async function () {

  });

  it("should change a Soul's name", async function () {

  });

  it("should view Soul name", async function () {

  });

  it("should return an array of string of all Souls in a wallet", async function () {

  });

  it("should not mint more than 20 lost souls in one tx", async function () {

  });

  it("should fail mint if sale has not started", async function () {

  });

  it("should fail mint if all Souls have been minted", async function () {

  });

  it("should fail if value sent is greater than the price * amount", async function () {

  });

  it("should not mint more reserve souls than reserve amount", async function () {

  });

  it("should mint LostSoul", async function () {

  });

  it("should not allow to change the name of the Soul if you are not owner", async function () {

  });

  it("should not allow to change the name if you are the owner but the name is the same", async function () {

  });
  
})
