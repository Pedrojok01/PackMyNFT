pragma solidity 0.8.20;

import "forge-std/Vm.sol";
import {console2} from "forge-std/Test.sol";
import {PackMyNFT} from "../src/PackMyNFT.sol";
import {Helpers} from "./helpers/Helpers.sol";

contract PackMyNFTTest_BatchMint is Helpers {
    function test_BatchMint() public {
        address to = address(this); // The recipient of the minted tokens
        uint256 amountOfPacks = 5; // Number of packs to mint

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        // Initialize each inner array and set the numbers
        uint256[][] memory arrayOfNumbers = new uint256[][](amountOfPacks);
        for (uint256 i = 0; i < amountOfPacks; i++) {
            uint256[] memory numbers = new uint256[](5);
            numbers[0] = 1 ether; // ETH amount
            numbers[1] = 1; // ERC20 length
            numbers[2] = 0; // ERC721 length
            numbers[3] = 0; // ERC1155 length
            numbers[4] = 100; // ERC20 amount
            arrayOfNumbers[i] = numbers;
        }

        uint256 requiredValue = arrayOfNumbers[0][0] * amountOfPacks; // Value required to mint
        uint256 requiredTokens = arrayOfNumbers[0][4] * amountOfPacks; // Tokens required to mint

        // Impersonate the user1 and approve PackMyNFT to spend tokens
        vm.prank(user1);
        mockERC20.approve(address(packMyNFT), requiredTokens);

        // Try to call batchMint and catch the revert message
        vm.prank(user1);
        packMyNFT.batchMint{value: requiredValue}(
            to,
            addresses,
            arrayOfNumbers,
            amountOfPacks
        );

        // Assertions
        for (uint256 i = 0; i < amountOfPacks; i++) {
            assertEq(packMyNFT.ownerOf(i + 1), to); // nonce start at 1
        }
    }

    function test_BatchMint_MaxPackSupplyExceeded() public {
        PackMyNFT limitedSupplyContract = new PackMyNFT(
            "PackMyNFT",
            "PMNFT",
            1
        );

        address to = address(this);
        uint256 amountOfPacks = 2;

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[][] memory arrayOfNumbers = new uint256[][](amountOfPacks);
        for (uint256 i = 0; i < amountOfPacks; i++) {
            arrayOfNumbers[i] = new uint256[](5);
            arrayOfNumbers[i][0] = 1 ether;
            arrayOfNumbers[i][1] = 1;
            arrayOfNumbers[i][2] = 0;
            arrayOfNumbers[i][3] = 0;
            arrayOfNumbers[i][4] = 100;
        }

        uint256 requiredValue = arrayOfNumbers[0][0] * amountOfPacks;

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__MaxSupplyReached()")
        );
        vm.prank(user1);
        limitedSupplyContract.batchMint{value: requiredValue}(
            to,
            addresses,
            arrayOfNumbers,
            amountOfPacks
        );
    }

    function test_BatchMint_MaxBatchPackExceeded() public {
        PackMyNFT limitedSupplyContract = new PackMyNFT(
            "PackMyNFT",
            "PMNFT",
            1000
        );

        address to = address(this);
        uint256 amountOfPacks = 250;

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[][] memory arrayOfNumbers = new uint256[][](amountOfPacks);
        for (uint256 i = 0; i < amountOfPacks; i++) {
            arrayOfNumbers[i] = new uint256[](5);
            arrayOfNumbers[i][0] = 0.01 ether;
            arrayOfNumbers[i][1] = 1;
            arrayOfNumbers[i][2] = 0;
            arrayOfNumbers[i][3] = 0;
            arrayOfNumbers[i][4] = 100;
        }

        uint256 requiredValue = arrayOfNumbers[0][0] * amountOfPacks;

        vm.expectRevert(abi.encodeWithSignature("PackMyNFT__TooManyPacks()"));
        vm.prank(user1);
        limitedSupplyContract.batchMint{value: requiredValue}(
            to,
            addresses,
            arrayOfNumbers,
            amountOfPacks
        );
    }

    function test_BatchMint_ToZeroAddress() public {
        uint256 amountOfPacks = 5;

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[][] memory arrayOfNumbers = new uint256[][](amountOfPacks);
        for (uint256 i = 0; i < amountOfPacks; i++) {
            arrayOfNumbers[i] = new uint256[](5);
            arrayOfNumbers[i][0] = 1 ether;
            arrayOfNumbers[i][1] = 1;
            arrayOfNumbers[i][2] = 0;
            arrayOfNumbers[i][3] = 0;
            arrayOfNumbers[i][4] = 100;
        }

        uint256 requiredValue = arrayOfNumbers[0][0] * amountOfPacks;

        vm.expectRevert(abi.encodeWithSignature("PackMyNFT__MintToAddress0()"));
        vm.prank(user1);
        packMyNFT.batchMint{value: requiredValue}(
            address(0),
            addresses,
            arrayOfNumbers,
            amountOfPacks
        );
    }

    function test_BatchMint_IncorrectEthValue() public {
        uint256 amountOfPacks = 5;

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[][] memory arrayOfNumbers = new uint256[][](amountOfPacks);
        for (uint256 i = 0; i < amountOfPacks; i++) {
            arrayOfNumbers[i] = new uint256[](5);
            arrayOfNumbers[i][0] = 1 ether;
            arrayOfNumbers[i][1] = 1;
            arrayOfNumbers[i][2] = 0;
            arrayOfNumbers[i][3] = 0;
            arrayOfNumbers[i][4] = 100;
        }

        uint256 incorrectValue = arrayOfNumbers[0][0] *
            amountOfPacks -
            0.1 ether;

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__ValuesDontMatch()")
        );
        vm.prank(user1);
        packMyNFT.batchMint{value: incorrectValue}(
            address(this),
            addresses,
            arrayOfNumbers,
            amountOfPacks
        );
    }

    function test_BatchMint_MismatchedArrayLengths() public {
        uint256 amountOfPacks = 5;

        address[] memory addresses = new address[](2); // Incorrect length
        addresses[0] = address(mockERC20);

        uint256[][] memory arrayOfNumbers = new uint256[][](amountOfPacks);
        for (uint256 i = 0; i < amountOfPacks; i++) {
            arrayOfNumbers[i] = new uint256[](5);
            arrayOfNumbers[i][0] = 1 ether;
            arrayOfNumbers[i][1] = 1;
            arrayOfNumbers[i][2] = 0;
            arrayOfNumbers[i][3] = 0;
            arrayOfNumbers[i][4] = 100;
        }

        uint256 requiredValue = arrayOfNumbers[0][0] * amountOfPacks;

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__ArraysDontMatch()")
        );
        vm.prank(user1);
        packMyNFT.batchMint{value: requiredValue}(
            address(this),
            addresses,
            arrayOfNumbers,
            amountOfPacks
        );
    }

    function test_BatchMint_ZeroAmounts() public {
        uint256 amountOfPacks = 5;

        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[][] memory arrayOfNumbers = new uint256[][](amountOfPacks);
        for (uint256 i = 0; i < amountOfPacks; i++) {
            arrayOfNumbers[i] = new uint256[](5);
            arrayOfNumbers[i][0] = 0; // Zero ETH amount
            arrayOfNumbers[i][1] = 1;
            arrayOfNumbers[i][2] = 0;
            arrayOfNumbers[i][3] = 0;
            arrayOfNumbers[i][4] = 0; // Zero ERC20 amount
        }

        vm.expectRevert(
            abi.encodeWithSignature("PackMyNFT__CantSendZeroAmount()")
        );
        vm.prank(user1);
        packMyNFT.batchMint{value: 0}(
            address(this),
            addresses,
            arrayOfNumbers,
            amountOfPacks
        );
    }
}
