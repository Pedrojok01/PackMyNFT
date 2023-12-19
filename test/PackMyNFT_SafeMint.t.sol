pragma solidity 0.8.20;

import "forge-std/Vm.sol";
import {console2} from "forge-std/Test.sol";
import {PackMyNFT} from "../src/PackMyNFT.sol";
import {Helpers} from "./helpers/Helpers.sol";

contract PackMyNFTTest_SafeMint is Helpers {
    function test_SafeMint() public {
        uint256 currentSupply = packMyNFT.totalSupply();
        assertEq(currentSupply, 0, "Current supply should be 0");
        // Mint a new token
        uint256 tokenId = _mintToken(user1);

        currentSupply = packMyNFT.totalSupply();
        assertEq(currentSupply, 1, "Current supply should now be 1");

        // Assertions
        assertEq(packMyNFT.ownerOf(tokenId), user1);
        assertEq(
            packMyNFT.tokenURI(tokenId),
            "ipfs://QmPdWmcbxqco4vBZf9cL6XsTHHNF54tVzu2JoMN357pwqw/metadata.json"
        );
        assertEq(address(packMyNFT).balance, 1 ether);
        assertEq(mockERC20.balanceOf(address(packMyNFT)), 100);
    }

    function test_SafeMintTokenId() public {
        uint256 tokenId_1 = _mintToken(user1);
        uint256 tokenId_2 = _mintToken(user2);
        uint256 tokenId_3 = _mintToken(user3);

        // Assertions
        assertEq(tokenId_1, 1);
        assertEq(packMyNFT.ownerOf(tokenId_1), user1);
        assertEq(tokenId_2, 2);
        assertEq(packMyNFT.ownerOf(tokenId_2), user2);
        assertEq(tokenId_3, 3);
        assertEq(packMyNFT.ownerOf(tokenId_3), user3);
    }

    function test_SafeMint_InvalidArrayLength() public {
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](17);
        numbers[0] = 2 ether; // Expected ETH amount
        numbers[1] = 1; // ERC20 length
        numbers[2] = 1; // ERC721 length
        numbers[3] = 10; // ERC1155 length
        numbers[4] = 1000; // ERC20 amount
        numbers[5] = 0;
        numbers[6] = 0;
        numbers[7] = 0;
        numbers[8] = 0;
        numbers[9] = 0;
        numbers[10] = 0;
        numbers[11] = 0;
        numbers[12] = 0;
        numbers[13] = 0;
        numbers[14] = 0;
        numbers[15] = 0;
        numbers[16] = 0;

        vm.prank(user1);
        mockERC20.approve(address(packMyNFT), numbers[4]);

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__InvalidArraysLength()")
        );
        vm.prank(user1);
        packMyNFT.safeMint{value: 2 ether}(user1, addresses, numbers); // Incorrect Array length
    }

    function test_SafeMint_WithIncorrectEthValue() public {
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 1 ether; // Expected ETH amount
        numbers[1] = 1; // ERC20 length
        numbers[2] = 0; // ERC721 length
        numbers[3] = 0; // ERC1155 length
        numbers[4] = 500_000; // ERC20 amount

        vm.prank(user1);
        mockERC20.approve(address(packMyNFT), numbers[4]);

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__InvalidNativeValue()")
        );
        vm.prank(user1);
        packMyNFT.safeMint{value: 0.5 ether}(user1, addresses, numbers); // Incorrect ETH value
    }

    function test_SafeMint_MaxPackSupplyReached() public {
        // Set maxPackSupply to 1 for this test
        PackMyNFT limitedSupplyContract = new PackMyNFT(
            "PackMyNFT",
            "PMNFT",
            1
        );

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 1 ether;
        numbers[1] = 1;
        numbers[2] = 0;
        numbers[3] = 0;
        numbers[4] = 100;

        vm.prank(user1);
        mockERC20.approve(address(limitedSupplyContract), numbers[4]);

        vm.prank(user1);
        limitedSupplyContract.safeMint{value: 1 ether}(
            user1,
            addresses,
            numbers
        );

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__MaxSupplyReached()")
        );
        vm.prank(user2);
        limitedSupplyContract.safeMint{value: 1 ether}(
            user2,
            addresses,
            numbers
        );
    }

    function test_SafeMint_ToZeroAddress() public {
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 1 ether;
        numbers[1] = 1;
        numbers[2] = 0;
        numbers[3] = 0;
        numbers[4] = 100;

        vm.expectRevert(abi.encodeWithSignature("PackMyNFT__MintToAddress0()"));
        packMyNFT.safeMint{value: 1 ether}(address(0), addresses, numbers);
    }

    function test_SafeMint_MismatchedArrayLengths() public {
        address[] memory addresses = new address[](2); // Incorrect length
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 1 ether;
        numbers[1] = 1;
        numbers[2] = 0;
        numbers[3] = 0;
        numbers[4] = 100;

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__ArraysDontMatch()")
        );
        vm.prank(user1);
        packMyNFT.safeMint{value: 1 ether}(user1, addresses, numbers);
    }

    function test_SafeMint_NumbersDontMatch() public {
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        // Create a numbers array with incorrect length
        uint256[] memory numbers = new uint256[](6); // Extra element
        numbers[0] = 1 ether;
        numbers[1] = 1;
        numbers[2] = 0;
        numbers[3] = 0;
        numbers[4] = 100;
        numbers[5] = 0; // Extra element

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__NumbersDontMatch()")
        );
        vm.prank(user1);
        packMyNFT.safeMint{value: 1 ether}(user1, addresses, numbers);
    }

    function test_SafeMint_ZeroAmounts() public {
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 0; // Zero ETH amount
        numbers[1] = 1;
        numbers[2] = 0;
        numbers[3] = 0;
        numbers[4] = 0; // Zero ERC20 amount

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__CantSendZeroAmount()")
        );
        vm.prank(user1);
        packMyNFT.safeMint{value: 0}(user1, addresses, numbers);
    }

    function test_MintWithERC721() public {
        // Set up addresses and numbers arrays for ERC721
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC721);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 1 ether; // ETH amount
        numbers[1] = 0; // ERC20 length
        numbers[2] = 1; // ERC721 length
        numbers[3] = 0; // ERC1155 length
        numbers[4] = 1; // ERC721 ID

        // Approve PackMyNFT to transfer the ERC721 token
        vm.startPrank(user1);
        mockERC721.approve(address(packMyNFT), 1);

        // Mint the bundle
        uint256 tokenId = packMyNFT.safeMint{value: 1 ether}(
            user1,
            addresses,
            numbers
        );
        vm.stopPrank();

        // Assertions
        assertEq(packMyNFT.ownerOf(tokenId), user1);
        assertEq(mockERC721.ownerOf(1), address(packMyNFT));
    }

    function test_MintWithERC1155() public {
        // Set up addresses and numbers arrays for ERC1155
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC1155);

        uint256[] memory numbers = new uint256[](6);
        numbers[0] = 1 ether; // ETH amount
        numbers[1] = 0; // ERC20 length
        numbers[2] = 0; // ERC721 length
        numbers[3] = 1; // ERC1155 length
        numbers[4] = 0; // ERC1155 ID
        numbers[5] = 3; // ERC1155 amount

        // Mint the bundle
        vm.startPrank(user1);
        mockERC1155.setApprovalForAll(address(packMyNFT), true);
        uint256 tokenId = packMyNFT.safeMint{value: 1 ether}(
            user1,
            addresses,
            numbers
        );
        vm.stopPrank();

        // Assertions
        assertEq(packMyNFT.ownerOf(tokenId), user1);
        assertEq(mockERC1155.balanceOf(address(packMyNFT), 0), 3);
    }
}
