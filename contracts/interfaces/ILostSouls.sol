// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// tokenOfOwnerByIndex from ERC721Enumerable
interface ILostSouls {
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
    function walletOfOwner(address _owner) external view returns(uint256[] memory);
    function ownerOf(uint256 tokenId) external view returns (address owner);
}