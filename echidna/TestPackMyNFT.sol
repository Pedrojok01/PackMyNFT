// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {PackMyNFT} from "../src/PackMyNFT.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";
import {MockERC721} from "../src/mocks/MockERC721.sol";
import {MockERC1155} from "../src/mocks/MockERC1155.sol";

contract TestPackMyNFT is PackMyNFT {
    MockERC20 mockERC20;
    MockERC721 mockERC721;
    MockERC1155 mockERC1155;

    uint256 private nonce;

    address constant OWNER = 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF; //address corresponding to private key 0x2
    address user1 = address(1);

    constructor() payable PackMyNFT("ECHIDNA_TEST", "TST", 100) {
        mockERC20 = new MockERC20(msg.sender);
        // mockERC20.mint(user1, 1000);
        mockERC721 = new MockERC721();
        mockERC721.safeMint(user1);
        mockERC1155 = new MockERC1155(msg.sender);
        // mockERC1155.mint(user1, 0, 5, "");
    }

    function test_max_pack_supply() public {
        assert(nonce <= MAX_SUPPLY);
    }

    function echidna_test_mint_to_address_zero() public returns (bool) {
        try this.safeMint(address(0), new address[](0), new uint256[](0)) {
            return false;
        } catch {
            return true;
        }
    }

    function echidna_test_array_size_limits() public returns (bool) {
        try this.safeMint(user1, new address[](16), new uint256[](16)) {
            return false;
        } catch {
            return true;
        }
    }

    // function echidna_test_eth_transfer_amount() public returns (bool) {
    //     return msg.value == numbers[0];
    // }

    function test_non_existent_token() public {
        uint256 nonExistentTokenId = nonce + 1;
        assert(_ownerOf(nonExistentTokenId) == address(0));
    }

    function test_safemint(
        address user,
        uint256 amount_eth,
        uint256 amount_token
    ) public {
        require(user != address(0), "user is zero address");

        mockERC20.mint(user, amount_token);
        mockERC20.approve(address(this), amount_token);

        uint256 balanceBefore = address(this).balance;
        uint256 balanceTokenBefore = mockERC20.balanceOf(user);

        address[] memory addresses = new address[](1);
        addresses[0] = address(0x123);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = amount_eth; // ETH amount
        numbers[1] = 1; // ERC20 length
        numbers[2] = 0; // ERC721 length
        numbers[3] = 0; // ERC1155 length
        numbers[4] = amount_token; // ERC20 amount

        uint256 tokenId = this.safeMint(user, addresses, numbers);
        uint256 balanceTokenAfter = mockERC20.balanceOf(user);

        // Assert the tokenId is valid
        assert(tokenId > 0);
        assert(tokenId == nonce);

        uint256 nonExistentTokenId = nonce + 1;
        assert(_ownerOf(nonExistentTokenId) == address(0));

        assert(address(this).balance == (balanceBefore + amount_eth));
        assert(balanceTokenAfter == (balanceBefore - amount_token));
    }

    function test_burn(
        address user,
        uint256 amount_eth,
        uint256 amount_token
    ) public {
        uint256 tokenId = _mintToken(user, amount_eth, amount_token);

        // Assert the tokenId is valid
        assert(tokenId > 0);
        assert(tokenId == nonce);

        uint256 balanceBefore = address(this).balance;
        uint256 balanceTokenBefore = mockERC20.balanceOf(user);

        this.burn(tokenId);

        uint256 balanceTokenAfter = mockERC20.balanceOf(user);
        uint256 balanceAfter = address(this).balance;

        assert(balanceAfter == (balanceBefore - amount_eth));
        assert(balanceTokenAfter == (balanceTokenBefore + amount_token));
    }

    function _mintToken(
        address user,
        uint256 amount_eth,
        uint256 amount_token
    ) internal returns (uint256) {
        require(user != address(0), "user is zero address");

        mockERC20.mint(user, amount_token);
        mockERC20.approve(address(this), amount_token);

        address[] memory addresses = new address[](1);
        addresses[0] = address(0x123);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = amount_eth; // ETH amount
        numbers[1] = 1; // ERC20 length
        numbers[2] = 0; // ERC721 length
        numbers[3] = 0; // ERC1155 length
        numbers[4] = amount_token; // ERC20 amount

        return this.safeMint(user, addresses, numbers);
    }
}
