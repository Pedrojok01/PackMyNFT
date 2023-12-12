// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {PackMyNFT} from "../src/PackMyNFT.sol";

contract PackMyNFTScript is Script {
    string constant NAME = "Pack My NFT";
    string private SYMBOL = "PMNFT";
    uint256 private TOTAL_SUPPLY = 0; // unlimited

    function run() public {
        uint256 deployer = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployer);

        PackMyNFT packMyNFT = new PackMyNFT(NAME, SYMBOL, TOTAL_SUPPLY);
        console2.log("Deployed PackMyNFT at:", address(packMyNFT));

        vm.stopBroadcast();
    }
}
