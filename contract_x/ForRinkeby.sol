// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ForTest is ERC721Enumerable, Ownable {

    string public XXXX_PROVENANCE = "";
    string _baseTokenURI;
    uint256 public constant MAX_XXXX = 9999;
    uint256 private xxxxReserved = 125;
    uint256 public constant maxxxxxPurchase = 20;
    uint256 private xxxxPrice = 0.03 ether;
    bool public salePaused = true;

    
    address t1;
    address t2;
    address t3;
    address t4;
    address t5;

    constructor(
        address _t1,
        address _t2,
        address _t3,
        address _t4,
        address _t5
        ) ERC721("ForRinkeby", "FR")  {
        t1 = _t1;
        t2 = _t2;
        t3 = _t3;
        t4 = _t4;
        t5 = _t5;
    }

    function saveLostSoul(uint256 num) public payable {
        uint256 supply = totalSupply();
        require( !salePaused,                              "Sale paused" );
        require( num <= maxxxxxPurchase,                  "You can adopt a maximum of 20 xxxx" );
        require( supply + num <= MAX_XXXX - xxxxReserved, "Exceeds maximum xxxx supply" );
        require( msg.value >= xxxxPrice * num,             "Ether sent is not correct" );

        for(uint256 i; i < num; i++){
            _safeMint( msg.sender, supply + i );
        }
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
        XXXX_PROVENANCE = provenanceHash;
    }

    function setPrice(uint256 _newPrice) public onlyOwner {
        xxxxPrice = _newPrice;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function getPrice() public view returns (uint256){
        return xxxxPrice;
    }

    function reserveSouls(address _to, uint256 _amount) external onlyOwner {
        require( _amount <= xxxxReserved, "Exceeds reserved xxxx supply" );

        uint256 supply = totalSupply();
        for(uint256 i; i < _amount; i++){
            _safeMint( _to, supply + i );
        }

        xxxxReserved -= _amount;
    }

    function pause(bool val) public onlyOwner {
        salePaused = val;
    }

    function withdrawAll() public payable onlyOwner {
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
    }
}