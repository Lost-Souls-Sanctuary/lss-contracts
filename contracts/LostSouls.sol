// SPDX-License-Identifier: MIT

// Lost Souls Sanctuary's research has lead us to uncover earth shattering truths about how our souls navigate in the after-life.
// What we've found is truly shocking, something that various three letter agencies won't like, or worse try to supress/slander if the information was released via mutable channels.
// Souls roam this very earth frantically trying to make whole with the universe before their time is up and they are forever striken to the bowels of the underworld.
// All hope is not lost! Though the discovery of the Higgs boson particle a group of ghost-savers have established communication with 10,000 Lost Souls and struck a deal. 
// The deal: a Sanctuary will be setup to help the Souls discover their mistakes, changes their lives and pass through to the elusive good place,
// in return the Lost Souls Sanctuary will be given exclusive access to study the ectoplasmic layer the Soul's reside in so we may better understand our mortal role here on Earth.

// Tip of the hat to the BoringBananaCo team

// <3 Lost Souls Sanctuary Team

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract LostSoulsSanctuary is ERC721, Ownable {
    
    using SafeMath for uint256;

    string public SOUL_PROVENANCE = ""; // IPFS URL WILL BE ADDED WHEN SOULS ARE ALL SOLD OUT
    
    string public LICENSE_TEXT = ""; // IT IS WHAT IT SAYS
    
    bool licenseLocked = false; // TEAM CAN'T EDIT THE LICENSE AFTER THIS GETS TRUE

    uint256 public constant soulPrice = 30000000000000000; // 0.03 ETH

    uint public constant maxSoulPurchase = 20;

    uint256 public constant MAX_SOULS = 10000; // 10k

    bool public saleIsActive = false;
    
    mapping(uint => string) public soulNames;
    
    // Reserve 125 Souls for team - Giveaways/Prizes etc
    uint public soulReserve = 125;
    
    event soulNameChange(address _by, uint _tokenId, string _name);
    
    event licenseisLocked(string _licenseText);

    constructor() ERC721("Lost Souls Sanctuary", "LSS") { }
    
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
    }
    
    function reserveSouls(address _to, uint256 _reserveAmount) public onlyOwner {        
        uint supply = totalSupply();
        require(_reserveAmount > 0 && _reserveAmount <= soulReserve, "Not enough reserve left for team");
        for (uint i = 0; i < _reserveAmount; i++) {
            _safeMint(_to, supply + i);
        }
        soulReserve = soulReserve.sub(_reserveAmount);
    }


    function setProvenanceHash(string memory provenanceHash) public onlyOwner {
        SOUL_PROVENANCE = provenanceHash;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _setBaseURI(baseURI);
    }


    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }
    
    
    function tokensOfOwner(address _owner) external view returns(uint256[] memory ) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[index] = tokenOfOwnerByIndex(_owner, index);
            }
            return result;
        }
    }
    
    // Returns the license for tokens
    function tokenLicense(uint _id) public view returns(string memory) {
        require(_id < totalSupply(), "CHOOSE A SOUL WITHIN RANGE");
        return LICENSE_TEXT;
    }
    
    // Locks the license to prevent further changes 
    function lockLicense() public onlyOwner {
        licenseLocked =  true;
        emit licenseisLocked(LICENSE_TEXT);
    }
    
    // Change the license
    function changeLicense(string memory _license) public onlyOwner {
        require(licenseLocked == false, "License already locked");
        LICENSE_TEXT = _license;
    }
    
    
    function mintLostSoul(uint numberOfTokens) public payable {
        require(saleIsActive, "Sale must be active to mint Soul");
        require(numberOfTokens > 0 && numberOfTokens <= maxSoulPurchase, "Can only mint 20 tokens at a time");
        require(totalSupply().add(numberOfTokens) <= MAX_SOULS, "Purchase would exceed max supply of Souls");
        require(msg.value >= soulPrice.mul(numberOfTokens), "Ether value sent is not correct");
        
        for(uint i = 0; i < numberOfTokens; i++) {
            uint mintIndex = totalSupply();
            if (totalSupply() < MAX_SOULS) {
                _safeMint(msg.sender, mintIndex);
            }
        }

    }
     
    function changeSoulName(uint _tokenId, string memory _name) public {
        require(ownerOf(_tokenId) == msg.sender, "Hey, your wallet doesn't own this soul!");
        require(sha256(bytes(_name)) != sha256(bytes(soulNames[_tokenId])), "New name is same as the current one");
        soulNames[_tokenId] = _name;
        
        emit soulNameChange(msg.sender, _tokenId, _name);
        
    }
    
    function viewSoulName(uint _tokenId) public view returns( string memory ){
        require( _tokenId < totalSupply(), "Choose a soul within range" );
        return soulNames[_tokenId];
    }
    
    
    // GET ALL SOULS OF A WALLET AS AN ARRAY OF STRINGS. WOULD BE BETTER MAYBE IF IT RETURNED A STRUCT WITH ID-NAME MATCH, would it?
    function soulNamesOfOwner(address _owner) external view returns(string[] memory ) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            // Return an empty array
            return new string[](0);
        } else {
            string[] memory result = new string[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[index] = soulNames[ tokenOfOwnerByIndex(_owner, index) ] ;
            }
            return result;
        }
    }
    
}