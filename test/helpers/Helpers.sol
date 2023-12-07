pragma solidity 0.8.20;

import "forge-std/Vm.sol";
import {Test} from "forge-std/Test.sol";

import {MockERC20} from "../../src/mocks/MockERC20.sol";
import {MockERC721} from "../../src/mocks/MockERC721.sol";
import {MockERC1155} from "../../src/mocks/MockERC1155.sol";
import {PackMyNFT} from "../../src/PackMyNFT.sol";

contract Helpers is Test {
    PackMyNFT packMyNFT;
    MockERC20 mockERC20;
    MockERC721 mockERC721;
    MockERC1155 mockERC1155;

    address owner;
    address user1 = address(1);
    address user2 = address(2);
    address user3 = address(3);

    event BundleAssets(
        address indexed firstHolder,
        uint256 indexed tokenId,
        address[] addresses,
        uint256[] numbers
    );

    event BundleAssetsClaimed(
        uint256 indexed tokenId,
        address indexed owner,
        address[] addresses,
        uint256[] numbers
    );

    function setUp() public {
        packMyNFT = new PackMyNFT("PackMyNFT", "PMNFT", 1000);
        mockERC20 = new MockERC20(msg.sender);
        mockERC721 = new MockERC721();
        mockERC1155 = new MockERC1155(msg.sender);

        owner = msg.sender;

        vm.deal(address(this), 100 ether);
        vm.deal(owner, 100 ether);
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        vm.deal(user3, 100 ether);

        vm.startPrank(owner);
        mockERC20.mint(user1, 1000);
        mockERC20.mint(user2, 1000);
        mockERC20.mint(user3, 1000);
        mockERC721.safeMint(user1);
        mockERC721.safeMint(user2);
        mockERC721.safeMint(user3);
        mockERC1155.mint(user1, 0, 5, "");
        mockERC1155.mint(user2, 0, 5, "");
        mockERC1155.mint(user3, 0, 5, "");
        vm.stopPrank();

        assertEq(user3.balance, 100 ether, "User3 should have 100 ETH");
        assertEq(
            mockERC20.balanceOf(user3),
            1000,
            "User3 should have 1000 ERC20"
        );
        assertEq(mockERC721.balanceOf(user2), 1, "User2 should have 1 ERC721");
        assertEq(
            mockERC1155.balanceOf(user3, 0),
            5,
            "User3 should have 5 ERC1155"
        );
    }

    function _mintToken(address to) internal returns (uint256) {
        address[] memory addresses = new address[](1);
        addresses[0] = address(mockERC20);

        uint256[] memory numbers = new uint256[](5);
        numbers[0] = 1 ether; // ETH amount
        numbers[1] = 1; // ERC20 length
        numbers[2] = 0; // ERC721 length
        numbers[3] = 0; // ERC1155 length
        numbers[4] = 100; // ERC20 amount

        vm.prank(to);
        mockERC20.approve(address(packMyNFT), numbers[4]);

        vm.expectEmit(true, false, true, true, address(packMyNFT));
        emit BundleAssets(to, 0, addresses, numbers);

        vm.prank(to);
        uint256 tokenId = packMyNFT.safeMint{value: 1 ether}(
            to,
            addresses,
            numbers
        );

        assertEq(packMyNFT.ownerOf(tokenId), to);

        return tokenId;
    }
}
