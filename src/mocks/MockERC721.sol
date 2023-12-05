// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    uint256 private _nextTokenId = 1;

    constructor() ERC721("Mock ERC721", "MERC721") {}

    function safeMint(address to) public {
        _safeMint(to, _nextTokenId);
        _nextTokenId++;
    }
}
