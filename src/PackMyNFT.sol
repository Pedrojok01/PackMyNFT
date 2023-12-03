// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IBundles} from "./IBundles.sol";

/**
 * @title PackMyNFT
 * @author Pierre ESTRABAUD <@Pedrojok01>
 * @dev Bundles assets (Native, ERC20, ERC721, ERC1155) into an NFT.
 *
 * Contract based on the EIP-3589: https://eips.ethereum.org/EIPS/eip-3589
 */

/**
 * Sighash   |   Function Signature
 * ================================
 * 1a7efeca  =>  hash(uint256,address[],uint256[])
 * e7e3d030  =>  safeMint(address,uint256,address[],uint256[])
 * 808bf31b  =>  batchMint(address,uint256,address[],uint256[][],uint256)
 * b7c8ac45  =>  burn(address,uint256,uint256,address[],uint256[])
 * c87b56dd  =>  tokenURI(uint256)
 * 01ffc9a7  =>  supportsInterface(bytes4)
 */

contract PackMyNFT is ERC721, ERC721Holder, ERC1155Holder, IBundles, Ownable {
    using SafeERC20 for IERC20;

    string private _baseURIextended;
    uint256 public immutable maxPackSupply;
    uint256 private nonce;

    struct BundleData {
        address[] addresses;
        uint256[] numbers;
    }

    mapping(uint256 => BundleData) private bundleData;

    error PackMyNFT__QueryForNonExistantToken();
    error PackMyNFT__TokenNotOwned();
    error PackMyNFT__MintToAddress0();
    error PackMyNFT__ArraysDontMatch();
    error PackMyNFT__NumbersDontMatch();
    error PackMyNFT__ValuesDontMatch();
    error PackMyNFT__MaxSupplyReached();
    error PackMyNFT__CantSendZeroAmount();

    constructor(
        string memory name,
        string memory symbol,
        string memory uri,
        uint256 maxSupply,
        address owner
    ) ERC721(name, symbol) Ownable(owner) {
        maxPackSupply = maxSupply;
        _baseURIextended = uri;
    }

    /*///////////////////////////////////////////////////////////////////////////////
                                MINT / BATCH_MINT / BURN
    ///////////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Transfer all assets to the escrow contract and emit an ERC721 NFT with a hash as token_id.
     * @param addresses Array containing all the contract addresses of every assets sent to the escrow contract.
     * @param numbers Array containing numbers, amounts and IDs for every assets sent to the escrow contract.
     */
    function safeMint(
        address to,
        uint256 lvlMin,
        address[] calldata addresses,
        uint256[] memory numbers
    ) public payable onlyOwner returns (uint256 tokenId) {
        _validateMintParameters(to, lvlMin, addresses, numbers);
        _transferAssetsToContract(addresses, numbers);

        tokenId = nonce;
        _mint(to, tokenId);
        bundleData[tokenId] = BundleData(addresses, numbers);
        nonce++;
        emit BundleAssets(to, tokenId, addresses, numbers);
    }

    /**
     * @dev Burn a previously emitted NFT to claim all the associated assets from the escrow contract.
     * @param _addresses Array containing all the contract addresses of every assets sent to the escrow contract.
     *  Emitted in the BundleAsset event (see interface).
     * @param _arrayOfNumbers Array of arrays containing numbers, amounts and IDs for every batch of assets sent
     *  to the escrow contract.
     * @param _amountOfPacks === the number of packs that will be minted in this batch.
     */
    function batchMint(
        address _to,
        uint256 _lvlMin,
        address[] calldata _addresses,
        uint256[][] calldata _arrayOfNumbers,
        uint256 _amountOfPacks
    ) external payable onlyOwner {
        if (_to == address(0)) revert PackMyNFT__MintToAddress0();
        if (msg.value != _arrayOfNumbers[0][0] * _amountOfPacks)
            revert PackMyNFT__ValuesDontMatch();
        if (maxPackSupply != 0 && nonce + _amountOfPacks > maxPackSupply)
            revert PackMyNFT__MaxSupplyReached();

        for (uint256 i = 0; i < _amountOfPacks; ) {
            safeMint(_to, _lvlMin, _addresses, _arrayOfNumbers[i]);
            unchecked {
                i++;
            }
        }

        emit BatchBundleAssets(_to, _amountOfPacks);
    }

    event BatchBundleAssets(address indexed firstHolder, uint256 amountOfPacks);

    /**
     * @dev Burn a previously emitted NFT to claim all the associated assets from the escrow contract.
     * @param tokenId === hash of all associated assets.
     */
    function burn(uint256 tokenId) public {
        address _owner = _msgSender();
        if (_owner != ownerOf(tokenId)) revert PackMyNFT__TokenNotOwned();

        (address[] memory addresses, uint256[] memory numbers) = getBundleData(
            tokenId
        );
        _burn(tokenId);
        _transferAssetsFromContract(_owner, addresses, numbers);

        delete bundleData[tokenId];
        emit BundleAssetsClaimed(tokenId, _owner, addresses, numbers);
    }

    /*///////////////////////////////////////////////////////////////////////////////
                                        VIEW
    ///////////////////////////////////////////////////////////////////////////////*/

    /**
     * @dev Allows to easily retrieve bundle data
     */
    function getBundleData(
        uint256 tokenId
    ) public view returns (address[] memory, uint256[] memory) {
        if (_ownerOf(tokenId) == address(0))
            revert PackMyNFT__QueryForNonExistantToken();
        BundleData storage data = bundleData[tokenId];
        return (data.addresses, data.numbers);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0))
            revert PackMyNFT__QueryForNonExistantToken();
        return _baseURIextended;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /*///////////////////////////////////////////////////////////////////////////////
                                    INTERNAL / PRIVATE
    ///////////////////////////////////////////////////////////////////////////////*/

    function _validateMintParameters(
        address to,
        uint256 lvlMin,
        address[] memory addresses,
        uint256[] memory numbers
    ) private view {
        uint8 currentLevel = loyaltyProgram.getMemberLevel(to);
        if (to == address(0)) revert PackMyNFT__MintToAddress0();
        if (currentLevel == 0) revert Redeemable__NonExistantUser();
        if (currentLevel < uint8(lvlMin))
            revert Redeemable__InsufficientLevel();
        if (addresses.length != numbers[1] + numbers[2] + numbers[3])
            revert PackMyNFT__ArraysDontMatch();
        if (addresses.length != numbers.length - 4 - numbers[3])
            revert PackMyNFT__NumbersDontMatch();
        if (maxPackSupply != 0 && nonce >= maxPackSupply)
            revert PackMyNFT__MaxSupplyReached();
    }

    function _transferAssetsToContract(
        address[] memory addresses,
        uint256[] memory numbers
    ) private {
        uint256 pointerA; //points to first erc20 address, if any
        uint256 pointerB = 4; //points to first erc20 amount, if any

        for (uint256 i = 0; i < numbers[1]; ) {
            if (numbers[pointerB] <= 0) revert PackMyNFT__CantSendZeroAmount();

            IERC20 token = IERC20(addresses[pointerA++]);
            uint256 orgBalance = token.balanceOf(address(this));
            token.safeTransferFrom(
                _msgSender(),
                address(this),
                numbers[pointerB]
            );
            numbers[pointerB++] = token.balanceOf(address(this)) - orgBalance;
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

        payable(to).transfer(numbers[0]);
    }
}
