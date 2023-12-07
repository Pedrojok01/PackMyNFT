// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IBundles} from "./IBundles.sol";

/**
 * @title PackMyNFT
 * @author @Pedrojok01
 * @dev Bundles assets (Native, ERC20, ERC721, ERC1155) into an NFT.
 *
 * Contract based on the EIP-3589: https://eips.ethereum.org/EIPS/eip-3589
 */

/**
 * Sighash   |   Function Signature
 * ================================
 * b8653d79  =>  safeMint(address,address[],uint256[])
 * 616b5039  =>  batchMint(address,address[],uint256[][],uint256)
 * 42966c68  =>  burn(uint256)
 * c87b56dd  =>  tokenURI(uint256)
 * 18160ddd  =>  totalSupply()
 * 01ffc9a7  =>  supportsInterface(bytes4)
 */

contract PackMyNFT is
    ERC721,
    ERC721Holder,
    ERC1155Holder,
    IBundles,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    string private constant BASE_URI =
        "ipfs://QmPdWmcbxqco4vBZf9cL6XsTHHNF54tVzu2JoMN357pwqw/metadata.json";
    uint256 private immutable maxArraySize = 15; // DoS protection
    uint256 private nonce; // Used as token Id + Total number of packs minted
    uint256 public immutable maxPackSupply; // 0 = no limit

    // Struct to store bundle data (simplifies the burn mechanism)
    struct BundleData {
        address[] addresses;
        uint256[] numbers;
    }

    mapping(uint256 => BundleData) bundleData;

    // Custom errors
    error PackMyNFT__NonExistantToken();
    error PackMyNFT__TokenNotOwned();
    error PackMyNFT__MintToAddress0();
    error PackMyNFT__InvalidNativeValue();
    error PackMyNFT__InvalidArraysLength();
    error PackMyNFT__ArraysDontMatch();
    error PackMyNFT__NumbersDontMatch();
    error PackMyNFT__ValuesDontMatch();
    error PackMyNFT__MaxSupplyReached();
    error PackMyNFT__CantSendZeroAmount();
    error PackMyNFT__EthTransferFailed();
    error PackMyNFT__ReentrantCallPrevented();

    /**
     * @param name_ Name of the Bundle collection
     * @param symbol_ Symbol of the Bundle collection
     * @param maxSupply  Maximum number of packs that can be minted (0 for unlimited)
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply
    ) ERC721(name_, symbol_) {
        maxPackSupply = maxSupply;
    }

    /*///////////////////////////////////////////////////////////////////////////////
                                MINT / BATCH_MINT / BURN
    ///////////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Transfer all assets to the escrow contract and emit an ERC721 NFT with a hash as token_id.
     * @param to Receiver of the pack to be minted (should be the sender in most case).
     * @param addresses Array containing all the contract addresses of every assets sent to the escrow contract.
     * @param numbers Array containing numbers, amounts and IDs for every assets sent to the escrow contract.
     */
    function safeMint(
        address to,
        address[] calldata addresses,
        uint256[] memory numbers
    ) public payable returns (uint256 tokenId) {
        uint256 maxSupply = maxPackSupply;
        if (maxSupply != 0 && nonce >= maxSupply)
            revert PackMyNFT__MaxSupplyReached();
        if (to == address(0)) revert PackMyNFT__MintToAddress0();
        if (msg.value != numbers[0]) revert PackMyNFT__InvalidNativeValue();
        tokenId = nonce;
        nonce++;
        _safeMint(to, tokenId, addresses, numbers);
        return tokenId;
    }

    /**
     * @dev Burn a previously emitted NFT to claim all the associated assets from the escrow contract.
     * @param addresses Array containing all the contract addresses of every assets sent to the escrow contract.
     *  Emitted in the BundleAsset event (see interface).
     * @param arrayOfNumbers Array of arrays containing numbers, amounts and IDs for every batch of assets sent
     *  to the escrow contract.
     * @param amountOfPacks === the number of packs that will be minted in this batch.
     */
    function batchMint(
        address to,
        address[] calldata addresses,
        uint256[][] calldata arrayOfNumbers,
        uint256 amountOfPacks
    ) external payable nonReentrant {
        uint256 maxSupply = maxPackSupply;
        if (maxSupply != 0 && nonce + amountOfPacks > maxSupply)
            revert PackMyNFT__MaxSupplyReached();
        if (to == address(0)) revert PackMyNFT__MintToAddress0();
        if (msg.value != arrayOfNumbers[0][0] * amountOfPacks)
            revert PackMyNFT__ValuesDontMatch();

        uint256 cachedNonce = nonce;
        nonce += amountOfPacks;

        for (uint256 i = 0; i < amountOfPacks; ) {
            _safeMint(to, cachedNonce, addresses, arrayOfNumbers[i]);
            cachedNonce++;
            unchecked {
                i++;
            }
        }
    }

    /**
     * @dev Burn a previously emitted NFT to claim all the associated assets from the escrow contract.
     * @param tokenId === hash of all associated assets.
     */
    function burn(uint256 tokenId) public nonReentrant {
        address burner = _msgSender();
        if (burner != ownerOf(tokenId)) revert PackMyNFT__TokenNotOwned();

        (address[] memory addresses, uint256[] memory numbers) = _getBundleData(
            tokenId
        );

        _burn(tokenId);
        delete bundleData[tokenId];
        emit BundleAssetsClaimed(tokenId, burner, addresses, numbers);
        _transferAssetsFromContract(burner, addresses, numbers);
    }

    /*///////////////////////////////////////////////////////////////////////////////
                                        VIEW
    ///////////////////////////////////////////////////////////////////////////////*/

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0))
            revert PackMyNFT__NonExistantToken();
        return BASE_URI;
    }

    function totalSupply() public view returns (uint256) {
        return nonce;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /*///////////////////////////////////////////////////////////////////////////////
                                    INTERNAL / PRIVATE
    ///////////////////////////////////////////////////////////////////////////////*/

    function _safeMint(
        address to,
        uint256 tokenId,
        address[] calldata addresses,
        uint256[] memory numbers
    ) private {
        if (addresses.length > maxArraySize || numbers.length > maxArraySize)
            revert PackMyNFT__InvalidArraysLength();
        if (addresses.length != numbers[1] + numbers[2] + numbers[3])
            revert PackMyNFT__ArraysDontMatch();
        if (addresses.length != numbers.length - 4 - numbers[3])
            revert PackMyNFT__NumbersDontMatch();

        uint256 pointerA; //points to first erc20 address, if any
        uint256 pointerB = 4; //points to first erc20 amount, if any

        for (uint256 i = 0; i < numbers[1]; ) {
            if (numbers[pointerB] <= 0) revert PackMyNFT__CantSendZeroAmount();

            IERC20(addresses[pointerA++]).safeTransferFrom(
                _msgSender(),
                address(this),
                numbers[pointerB++]
            );
            unchecked {
                i++;
            }
        }
        for (uint256 j = 0; j < numbers[2]; ) {
            IERC721(addresses[pointerA++]).safeTransferFrom(
                _msgSender(),
                address(this),
                numbers[pointerB++]
            );
            unchecked {
                j++;
            }
        }
        for (uint256 k = 0; k < numbers[3]; ) {
            IERC1155(addresses[pointerA++]).safeTransferFrom(
                _msgSender(),
                address(this),
                numbers[pointerB],
                numbers[numbers[3] + pointerB++],
                ""
            );
            unchecked {
                k++;
            }
        }

        bundleData[tokenId] = BundleData(addresses, numbers);
        _mint(to, tokenId);
        emit BundleAssets(to, tokenId, addresses, numbers);
    }

    /**
     * @dev Allows to easily retrieve bundle data
     */
    function _getBundleData(
        uint256 tokenId
    ) private view returns (address[] memory, uint256[] memory) {
        BundleData storage data = bundleData[tokenId];
        return (data.addresses, data.numbers);
    }

    function _transferAssetsFromContract(
        address to,
        address[] memory addresses,
        uint256[] memory numbers
    ) private {
        uint256 pointerA; //points to first erc20 address, if any
        uint256 pointerB = 4; //points to first erc20 amount, if any

        for (uint256 i = 0; i < numbers[1]; ) {
            IERC20(addresses[pointerA++]).safeTransfer(to, numbers[pointerB++]);
            unchecked {
                i++;
            }
        }
        for (uint256 j = 0; j < numbers[2]; ) {
            IERC721(addresses[pointerA++]).safeTransferFrom(
                address(this),
                to,
                numbers[pointerB++]
            );
            unchecked {
                j++;
            }
        }
        for (uint256 k = 0; k < numbers[3]; ) {
            IERC1155(addresses[pointerA++]).safeTransferFrom(
                address(this),
                to,
                numbers[pointerB],
                numbers[numbers[3] + pointerB++],
                ""
            );
            unchecked {
                k++;
            }
        }

        (bool success, ) = payable(to).call{value: numbers[0]}("");
        if (!success) revert PackMyNFT__EthTransferFailed();
    }
}
