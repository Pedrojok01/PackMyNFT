pragma solidity 0.8.20;

import "forge-std/Vm.sol";
import {console2} from "forge-std/Test.sol";
import {PackMyNFT} from "../src/PackMyNFT.sol";
import {Helpers} from "./helpers/Helpers.sol";

contract PackMyNFTTest_Burn is Helpers {
    function test_Burn_Success() public {
        // Mint a new token
        uint256 tokenId = _mintToken(user1);

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 1 ether; // ETH amount
        numbers[1] = 1; // ERC20 length
        numbers[2] = 0; // ERC721 length
        numbers[3] = 0; // ERC1155 length
        numbers[4] = 100; // ERC20 amount

        vm.expectEmit(true, true, true, true, address(packMyNFT));
        emit BundleAssetsClaimed(0, user1, addresses, numbers);

        // Burn the token
        vm.prank(user1);
        packMyNFT.burn(tokenId);

        // Assertions
        vm.expectRevert(
            abi.encodeWithSignature("ERC721NonexistentToken(uint256)", tokenId)
        );
        packMyNFT.ownerOf(tokenId);
    }

    function test_BurnAndClaimERC721AndERC1155() public {
        // First, mint a bundle with both ERC721 and ERC1155
        address[] memory addresses = new address[](2);
        addresses[0] = address(mockERC721);
        addresses[1] = address(mockERC1155);

        uint256[] memory numbers = new uint256[](7);
        numbers[0] = 0.1 ether; // ETH amount
        numbers[1] = 0; // ERC20 length
        numbers[2] = 1; // ERC721 length
        numbers[3] = 1; // ERC1155 length
        numbers[4] = 1; // ERC721 ID
        numbers[5] = 0; // ERC1155 ID
        numbers[6] = 3; // ERC1155 amount

        // Approve and mint
        vm.startPrank(user1);
        mockERC721.approve(address(packMyNFT), 1);
        mockERC1155.setApprovalForAll(address(packMyNFT), true);
        uint256 tokenId = packMyNFT.safeMint{value: 0.1 ether}(
            user1,
            addresses,
            numbers
        );

        // Assertions before burning
        assertEq(tokenId, 0, "Token ID should be 0");
        assertEq(packMyNFT.ownerOf(tokenId), user1, "Owner should be user1");
        assertEq(
            mockERC721.ownerOf(1),
            address(packMyNFT),
            "Owner should be PackMyNFT"
        );
        assertEq(
            mockERC1155.balanceOf(address(packMyNFT), 0),
            3,
            "PackMyNFT should have 3 ERC1155 tokens"
        );
        assertEq(
            mockERC1155.balanceOf(user1, 0),
            2,
            "user1 should have 2 ERC1155 tokens"
        );

        // Burn the bundle
        packMyNFT.burn(tokenId);
        vm.stopPrank();

        // Assertions
        assertEq(mockERC721.ownerOf(1), user1);
        assertEq(mockERC1155.balanceOf(user1, 0), 5);
        assertEq(mockERC1155.balanceOf(address(packMyNFT), 0), 0);
    }

    function test_Burn_NonexistentToken() public {
        uint256 nonexistentTokenId = 9999; // Assuming this token doesn't exist

        vm.expectRevert(
            abi.encodeWithSignature(
                "ERC721NonexistentToken(uint256)",
                nonexistentTokenId
            )
        );
        vm.prank(user1);
        packMyNFT.burn(nonexistentTokenId);
    }

    function test_Burn_ByNonOwner() public {
        // Mint a new token
        uint256 tokenId = _mintToken(user1);

        vm.expectRevert(abi.encodeWithSignature("PackMyNFT__TokenNotOwned()"));
        vm.prank(user2); // User2 is not the owner
        packMyNFT.burn(tokenId);
    }

    function test_Burn_EthTransferFailed() public {
        // Mint a new token with some Ether value
        uint256 tokenId = _mintToken(user1);

        // Set the contract's Ether balance to zero
        vm.deal(address(packMyNFT), 0);

        // Expect the custom error when trying to burn the token
        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__EthTransferFailed()")
        );
        vm.prank(user1);
        packMyNFT.burn(tokenId);
    }
}
