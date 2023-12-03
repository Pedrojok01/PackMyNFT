// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

/**
 * @title Interface for PackMyNFT.sol contract;
 * @author @Pedrojok01
 *
 * * Contract based on the EIP-3589: https://eips.ethereum.org/EIPS/eip-3589
 */

interface IBundles {
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

    /**
     * @dev to assemble lossless assets
     * @param to the receiver of the assembly token
     * @param addresses concat assets addresses;
     * e.g. [ERC-20_address1, ERC-20_address2, ERC-721_address_1, ERC-1155_address_1, ERC-1155_address_2]
     * @param numbers describes how many eth, ERC-20 token addresses length, ERC-721 token addresses length,
     * ERC-1155 token addresses length, ERC-20 token amounts, ERC-721 token ids, ERC-1155 token ids and amounts.
     */
    function safeMint(
        address to,
        uint256 lvlMin,
        address[] calldata addresses,
        uint256[] memory numbers
    ) external payable returns (uint256 tokenId);

    /**
     * @dev burn this token and releases assembled assets
     * @param tokenId of the token to burn
     */
    function burn(uint256 tokenId) external;

    /**
     * @dev burn this token and releases assembled assets
     * @param tokenId of the token to burn
     */
    function getBundleData(
        uint256 tokenId
    ) external view returns (address[] memory, uint256[] memory);
}
