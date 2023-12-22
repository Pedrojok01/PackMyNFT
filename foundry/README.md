<div align="center">

<img src="../frontend/public/img/packmynft_logo.png" width="100px"/>
<br><br>

<h1><strong> Pack My NFT - Smart-Contracts </strong></h1>
</div>

<br>

## Description

PackMyNFT is an innovative web application designed for any EVM blockchains, enabling users to bundle various assets into a single NFT pack. This project simplifies the process of grouping native coins, ERC20 tokens, and NFTs (ERC721 and ERC1155) and allows to create up to 200 packs per transactions. The packs are represented as ERC721 tokens, which means they can be traded on any marketplace supporting this standard.

Try it yourself: [https://packmynft.com/](https://packmynft.com/)

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Setup

### Install the npm dependencies with:

```shell
yarn install
```

### Then run the following commands to install the dependencies required by forge:

```shell
yarn forge:setup
```

## Usage

### Build the smart contracts

```shell
$ yarn build
```

### Test

```shell
$ yarn test
```

### Coverage

```shell
$ yarn cover
# or
yarn cover:debug
```

### Format & Lint

```shell
$ yarn format
# and
$ yarn lint
```

### Slither Analysis

```shell
$ yarn slither
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

## Smart Contracts Deployment

### Simulate the deployment

Make sure to edit the `--rpcurl` flag in the package.json file to point to the chain you want to deploy to.

```shell
yarn simulate
```

### Deploy

Make sure to edit the `--rpcurl` and `--etherscan-api-key` flags in the package.json file.

```shell
yarn deploy
```

### Verify

It should have been automatically done after the contract deployment. But, if you need to to it manually for some reason, edit the `--chain` and `--etherscan-api-key` flags and add the contract address in the package.json file.

```shell
yarn verify
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

### ⚠️ This code has not been audited. You at your own risks.

<br></br>
