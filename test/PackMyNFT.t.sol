pragma solidity 0.8.20;

import "forge-std/Vm.sol";
import {console2} from "forge-std/Test.sol";
import {PackMyNFT} from "../src/PackMyNFT.sol";
import {Helpers} from "./helpers/Helpers.sol";

contract PackMyNFTInvariant is Helpers {
    function test_TokenURI_Success() public {
        // Mint a new token
        uint256 tokenId = _mintToken(user1);

        // Retrieve the token URI
        string memory uri = packMyNFT.tokenURI(tokenId);

        // Assertions
        assertEq(
            uri,
            "ipfs://QmPdWmcbxqco4vBZf9cL6XsTHHNF54tVzu2JoMN357pwqw/metadata.json"
        );
    }

    function test_TokenURI_NonexistentToken() public {
        uint256 nonexistentTokenId = 9999; // Assuming this token doesn't exist

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__NonExistantToken()")
        );
        packMyNFT.tokenURI(nonexistentTokenId);
    }

    function test_SupportsInterface() public {
        // ERC721 interface ID
        bytes4 erc721InterfaceId = 0x80ac58cd;
        assertTrue(packMyNFT.supportsInterface(erc721InterfaceId));

        // ERC1155 token receiver interface ID
        bytes4 erc1155TokenReceiverInterfaceId = 0x4e2312e0;
        assertTrue(
            packMyNFT.supportsInterface(erc1155TokenReceiverInterfaceId)
        );

        // Invalid interface ID
        bytes4 invalidInterfaceId = 0xffffffff;
        assertFalse(packMyNFT.supportsInterface(invalidInterfaceId));
    }

    function invariant_totalSupply() public view {
        if (packMyNFT.maxPackSupply() != 0) {
            assert(packMyNFT.totalSupply() <= packMyNFT.maxPackSupply());
        }
    }

    function invariant_validOwnership() public view {
        uint256 totalSupply = packMyNFT.totalSupply();
        for (uint256 i = 0; i < totalSupply; i++) {
            address tokenOwner = packMyNFT.ownerOf(i);
            assert(tokenOwner != address(0));
        }
    }

    function testFuzz_safeMint(uint256 ethAmount, uint256 erc20Amount) public {
        // Skip invalid values
        if (
            ethAmount > address(this).balance ||
            erc20Amount > 1000 || // user1 has a total supply of 1000
            erc20Amount == 0
        ) return;

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = ethAmount;
        numbers[1] = 1;
        numbers[2] = 0;
        numbers[3] = 0;
        numbers[4] = erc20Amount;

        vm.prank(user1);
        mockERC20.approve(address(packMyNFT), erc20Amount);

        vm.prank(user1);
        packMyNFT.safeMint{value: ethAmount}(user1, addresses, numbers);
    }

    function testFuzz_batchMint(uint256 numPacks) public {
        // Limit the number of packs to avoid excessive gas usage
        numPacks = (numPacks % 10) + 1;

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[][] memory arrayOfNumbers = new uint256[][](numPacks);
        for (uint256 i = 0; i < numPacks; i++) {
            arrayOfNumbers[i] = new uint256[](5);
            arrayOfNumbers[i][0] = 1 ether;
            arrayOfNumbers[i][1] = 1;
            arrayOfNumbers[i][2] = 0;
            arrayOfNumbers[i][3] = 0;
            arrayOfNumbers[i][4] = 100;
        }

        uint256 requiredValue = arrayOfNumbers[0][0] * numPacks;

        vm.prank(user1);
        mockERC20.approve(address(packMyNFT), 100 * numPacks);

        vm.prank(user1);
        packMyNFT.batchMint{value: requiredValue}(
            address(this),
            addresses,
            arrayOfNumbers,
            numPacks
        );
    }
}
