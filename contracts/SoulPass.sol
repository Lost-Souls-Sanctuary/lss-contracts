// SPDX-License-Identifier: MIT

// Lost Souls Sanctuary's research has lead us to uncover earth shattering truths about how our souls navigate in the after-life.
// What we've found is truly shocking, something that various three letter agencies won't like, or worse try to supress/slander if the information was released via mutable channels.
// Souls roam this very earth frantically trying to make whole with the universe before their time is up and they are forever striken to the bowels of the underworld.
// All hope is not lost! Though the discovery of the Higgs boson particle a group of ghost-savers have established communication with 10,000 Lost Souls and struck a deal. 
// The deal: a Sanctuary will be setup to help the Souls discover their mistakes, changes their lives and pass through to the elusive good place,
// in return the Lost Souls Sanctuary will be given exclusive access to study the ectoplasmic layer the Soul's reside in so we may better understand our mortal role here on Earth.
//
// <3 LS Sanctuary team
// @glu

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract SoulPass is ERC721Enumerable, Ownable {

    string public SOUL_PROVENANCE = "";
    string _baseTokenURI;
    uint256 public constant MAX_SOULPASS = 5000;
    //uint256 private soulReserved = 125;
    //uint256 public constant maxSoulsPurchase = 20;
    //uint256 private soulPrice = 0.03 ether;
    bool public mintPaused = true;
    mapping (uint256 => bool) public soulClaimed;

    address lostSouls;

    constructor(
        address LostSoulsContract
        ) ERC721("SoulPass", "SP") {
        lostSouls = LostSoulsContract;
    }

    // Mint All SoulPass
    // Mint Some SoulPass
    function claimAllSoulPass(uint256[] memory soulArray) public {
        uint256 supply = totalSupply();
        require( !mintPaused,                              "Mint paused" );
        // Check if we hit max
        require( supply <= MAX_SOULPASS, "Exceeds maximum SoulPass supply" );
        require(soulArray.length % 2 == 0,"Send an even amount of Souls");

        for(uint256 i;i<soulArray.length;i+=2){
            claimSoulPass(soulArray[i],soulArray[i+1]);
        }
    }

    // returns array of souls you own that have not been claimed 
    function soulNotClaimed(address _owner) public view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint256 i; i < tokenCount; i++){
            if(!soulClaimed[i]){
                tokensId[i] = tokenOfOwnerByIndex(_owner, i);
            }
        }
        return tokensId;
    }

    // Mint One SoulPass
    function claimSoulPass(uint256 soulOne, uint256 soulTwo) public {
		uint256 supply = totalSupply();
		require( !mintPaused,                              "Mint paused" );
		// Check if we hit max
		require( supply <= MAX_SOULPASS, "Exceeds maximum SoulPass supply" );
		require(IERC721(lostSouls).ownerOf(soulOne) == msg.sender,"You do not own soul one");
		require(IERC721(lostSouls).ownerOf(soulTwo) == msg.sender,"You do not own soul two");
		// Already Claimed
		require(!soulClaimed[soulOne],"Soul one already claimed");
		require(!soulClaimed[soulTwo],"Soul two already claimed");

		soulClaimed[soulOne] = true;
		soulClaimed[soulTwo] = true;
         _safeMint( msg.sender, supply);   
    }

    function walletOfOwner(address _owner) public view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint256 i; i < tokenCount; i++){
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function setProvenanceHash(string memory provenanceHash) public onlyOwner {
        SOUL_PROVENANCE = provenanceHash;
    }

    /*function setPrice(uint256 _newPrice) public onlyOwner {
        soulPrice = _newPrice;
    }*/

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    /*function getPrice() public view returns (uint256){
        return soulPrice;
    }*/

    /*function reserveSouls(address _to, uint256 _amount) external onlyOwner {
        require( _amount <= soulReserved, "Exceeds reserved Soul supply" );

        uint256 supply = totalSupply();
        for(uint256 i; i < _amount; i++){
            _safeMint( _to, supply + i );
        }

        soulReserved -= _amount;
    }*/

    function pause(bool val) public onlyOwner {
        mintPaused = val;
    }

    /*function withdrawAll() public payable onlyOwner {
        uint sale1 = address(this).balance * 8  / 100;
        uint sale2 = address(this).balance * 6  / 100;
        uint sale3 = address(this).balance * 18 / 100;
        uint sale4 = address(this).balance * 18 / 100;
        uint sale5 = address(this).balance * 50 / 100;

        payable(t1).transfer(sale1);
        payable(t2).transfer(sale2);
        payable(t3).transfer(sale3);
        payable(t4).transfer(sale4);
        payable(t5).transfer(sale5);
    }*/
}