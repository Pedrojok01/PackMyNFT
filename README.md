<div align="center">

<img src="./frontend/public/img/packmynft_logo.png" width="100px"/>
<br><br>

<h1><strong> Pack My NFT </strong></h1>

[![Stargazers](https://img.shields.io/github/stars/Pedrojok01/PackMyNFT)](https://github.com/Pedrojok01/PackMyNFT/stargazers)
[![Forks](https://img.shields.io/github/forks/Pedrojok01/PackMyNFT)](https://github.com/Pedrojok01/PackMyNFT/fork)
[![Issues](https://img.shields.io/github/issues/Pedrojok01/PackMyNFT)](https://github.com/Pedrojok01/PackMyNFT/issues)
[![MIT License](https://img.shields.io/github/license/Pedrojok01/PackMyNFT)](https://github.com/Pedrojok01/PackMyNFT/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/Pedrojok01/PackMyNFT/graph/badge.svg?token=ASH2OVKXQA)](https://codecov.io/gh/Pedrojok01/PackMyNFT)
![Vercel](https://img.shields.io/github/deployments/Pedrojok01/PackMyNFT/production?label=Vercel&logo=Vercel&logoColor=white)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?style=flat&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/pierre-e/)

<br>

![Preview](/frontend/public/gif/preview.gif)

<br>

</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Deployment](#deployment)
  - [Mainnet:](#mainnet)
  - [Testnet:](#testnet)
- [Try it yourself:](#try-it-yourself)
- [Mint Pack(s)](#mint-packs)
- [Claim Pack(s)](#claim-packs)
- [Features](#features)
- [Built With:](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Contributing](#contributing)
  - [License](#license)
- [⚠️ This code has not been audited. Use at your own risk.](#️-this-code-has-not-been-audited-use-at-your-own-risk)

## Description

PackMyNFT is an innovative web application designed for any EVM blockchain, enabling users to bundle various assets into a single NFT pack. This project simplifies the process of grouping native coins, ERC20 tokens, and NFTs (ERC721 and ERC1155), and allows to create up to 200 packs per transaction. The packs are represented as ERC721 tokens, which means they can be traded on any marketplace supporting this standard.

## Deployment

The project is currently deployed at this address (same for all chains):

```ts
address: `0x${string}` = "0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b";
```

on the following networks:

### Mainnet:

Deployed & Verified on:

- [Ethereum](https://etherscan.io/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code) // Might come later
- [Polygon](https://polygonscan.com/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Optimism](https://optimistic.etherscan.io/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Arbitrum One](https://arbiscan.io/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Fantom Opera](https://ftmscan.com/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Binance Smart Chain](https://bscscan.com/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)

### Testnet:

Deployed & Verified on:

- [Ethereum Sepolia](https://sepolia.etherscan.io/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Polygon Mumbai](https://mumbai.polygonscan.com/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Optimism Goerli](https://goerli-optimism.etherscan.io/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Arbitrum Sepolia](https://sepolia.arbiscan.io/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code) // Not verified
- [Fantom testnet](https://testnet.ftmscan.com/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code)
- [Bsc Testnet](https://testnet.bscscan.com/address/0x99482d34dD610067b66b0A32Fa3Cf1a512D77b2b#code) // Not verified

## Try it yourself:

[https://packmynft.com/](https://packmynft.com/)

## Mint Pack(s)

1. **Select your assets**:

Simply select the assets that you want to bundle into a pack, then click on the "Next" button.

2. **Check pack content and enter the desired amount of pack(s)**:

On the following screen, double-check the content of your pack(s), then enter the number of pack(s) that you want to mint.

3. **Mint your packs**:

Finally, click on the `Mint` button. You will be prompted to sign approvals depending on what assets you decided to pack, and to sign the transaction(s) to mint the pack(s). Once the transaction is confirmed, you will be able to claim the assets from the pack(s) by burning them.

<b>Note: Make sure you have enough funds to pay for gas fees, especially if you want to batch-mint a lot of packs at once!

Note 2: Since you can batch-mint up to 10,000 packs in a raw, you might have to sign multiple transactions to mint all your packs (200 packs per transaction).
</b>

<br>

![Preview](/frontend/public/gif/mint.gif)

<br>

## Claim Pack(s)

1. **Select the pack to claim**:

Simply select the pack that you want to claim, then click on the "Claim" button.

2. **Wait and see the content**:

After the transaction is confirmed, you will be able to see the content that you have just unpacked.

<br>

![Preview](/frontend/public/gif/claim.gif)

<br>

## Features

- **Asset Bundling**: Combine native coins, ERC20 tokens, and NFTs into a single NFT pack.
- **Asset Claiming**: Claim the assets from a pack by burning it.
- **Batched Transactions**: Create up to 200 packs per transactions (Minting 10,000 packs would only require 50 transactions).
- **Multi-Chain Support**: Supports Ethereum, Polygon, Optimism, Arbitrum, Fantom, and Binance Smart Chain.
- **Responsive Design**: Fully responsive and accessible on various devices and screen sizes.
- **Simple UI/UX**: Intuitive and easy-to-use interface.

## Built With:

- [![nextjs]][nextjs-url]
- [![typescript]][typescript-url]
- [![chakraui]][chakraui-url]
- [![viem]][viem-url]
- [![wagmi]][wagmi-url]
- [![Rainbowkit]][rainbowkit-url]
- [![prettier]][prettier-url]
- [![ESLint]][eslint-url]

## Getting Started

### Prerequisites

- [node.js](https://nodejs.org/) installed (developed on LTS v18)
- [bun](https://bun.sh/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) installed
- Git
- Ethereum Wallet (like [MetaMask](https://metamask.io/))

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/Pedrojok01/PackMyNFT.git .
```

2. **Navigate to the Repositories**

There are two repositories, one for the frontend and one for the smart contracts (foundry). Unless you want to deploy your own contracts, you will only need to install the frontend dependencies.

Report to the readme files of each repository for more information about the installation process.

### Contributing

Contributions to PackMyNFT are always welcome, whether it be improvements to the documentation, new functionality, or bug fixes. Feel free to fork the project and create a pull request.

### License

Distributed under the MIT License. See [License](LICENSE.md) for more information.

<br>

## ⚠️ This code has not been audited. Use at your own risk.

<br></br>

<div align="center">

<h3> ⭐️ Leave a star if you like it! ⭐️</h3>
<h3>And if you want to pay me a coffee or help with contract deployment costs, a donation is always welcome! <h3>

[![btc_qrcode](https://raw.githubusercontent.com/Pedrojok01/Import-CryptoData-into-GoogleSheet/main/btc_qrcode.png)](https://raw.githubusercontent.com/Pedrojok01/Import-CryptoData-into-GoogleSheet/main/bitcoin-address.txt)

```
BTC: bc1pgud5lk850jrk7ty3kyzazntwdnnl6xrnm2wm5trdz7myfkhccglskqmgdk
```

</div>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[nextjs]: https://img.shields.io/badge/Next.js_v13.5-000000?style=for-the-badge&logo=next.js&logoColor=FFFFFF
[nextjs-url]: https://nextjs.org/
[typescript]: https://img.shields.io/badge/typescript_v5.2.2-375BD2?style=for-the-badge&logo=typescript&logoColor=61DAFB
[typescript-url]: https://www.typescriptlang.org/
[chakraui]: https://img.shields.io/badge/ChakraUI-purple?style=for-the-badge&logo=ChakraUI&logoColor=319795
[chakraui-url]: https://chakra-ui.com/
[wagmi]: https://img.shields.io/badge/Wagmi-35324a?style=for-the-badge&logo=data:image/png;base64,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
[wagmi-url]: https://wagmi.sh/
[Rainbowkit]: https://img.shields.io/badge/Rainbowkit-006600?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMCAwaDEyMHYxMjBIMHoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMjAgMzhoNmMzMSAwIDU2IDI1IDU2IDU2djZoMTJjMyAwIDYtMyA2LTYgMC00MS0zMy03NC03NC03NC0zIDAtNiAzLTYgNnYxMloiLz48cGF0aCBmaWxsPSJ1cmwoI2MpIiBkPSJNODQgOTRoMTZjMCAzLTMgNi02IDZIODR2LTZaIi8+PHBhdGggZmlsbD0idXJsKCNkKSIgZD0iTTI2IDIwdjE2aC02VjI2YzAtMyAzLTYgNi02WiIvPjxwYXRoIGZpbGw9InVybCgjZSkiIGQ9Ik0yMCAzNmg2YzMyIDAgNTggMjYgNTggNTh2Nkg2NnYtNmMwLTIyLTE4LTQwLTQwLTQwaC02VjM2WiIvPjxwYXRoIGZpbGw9InVybCgjZikiIGQ9Ik02OCA5NGgxNnY2SDY4di02WiIvPjxwYXRoIGZpbGw9InVybCgjZykiIGQ9Ik0yMCA1MlYzNmg2djE2aC02WiIvPjxwYXRoIGZpbGw9InVybCgjaCkiIGQ9Ik0yMCA2MmMwIDMgMyA2IDYgNiAxNCAwIDI2IDEyIDI2IDI2IDAgMyAzIDYgNiA2aDEwdi02YzAtMjMtMTktNDItNDItNDJoLTZ2MTBaIi8+PHBhdGggZmlsbD0idXJsKCNpKSIgZD0iTTUyIDk0aDE2djZINThjLTMgMC02LTMtNi02WiIvPjxwYXRoIGZpbGw9InVybCgjaikiIGQ9Ik0yNiA2OGMtMyAwLTYtMy02LTZWNTJoNnYxNloiLz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIC03NCA3NCAwIDI2IDk0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjgiIHN0b3AtY29sb3I9IiNGRjQwMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NzU0QzkiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgLTU4IDU4IDAgMjYgOTQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuNyIgc3RvcC1jb2xvcj0iI0ZGRjcwMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJoIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAtNDIgNDIgMCAyNiA5NCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii42IiBzdG9wLWNvbG9yPSIjMEFGIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxNyAwIDAgNDUuMzMzMyA1MSA5NykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMEFGIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImoiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIC0xNyAzMjIuMzcgMCAyMyA2OSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMEFGIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+PC9yYWRpYWxHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSI2MCIgeDI9IjYwIiB5MT0iMCIgeTI9IjEyMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxNzQyOTkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDFFNTkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjgzIiB4Mj0iMTAwIiB5MT0iOTciIHkyPSI5NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGRjQwMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NzU0QzkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZCIgeDE9IjIzIiB4Mj0iMjMiIHkxPSIyMCIgeTI9IjM3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg3NTRDOSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGNDAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJmIiB4MT0iNjgiIHgyPSI4NCIgeTE9Ijk3IiB5Mj0iOTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5OTAxIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIyMyIgeDI9IjIzIiB5MT0iNTIiIHkyPSIzNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGRkY3MDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk5MDEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=&logoColor=4FC08D
[rainbowkit-url]: https://github.com/rainbow-me/rainbowkit#readme
[viem]: https://img.shields.io/badge/Viem-ffc517?style=for-the-badge&logo=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAeAB4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+M39iD9iH4gft8fFuz+Bvwm+JvwI8D/FDXbvTNN8D+GfjZ8Q5vh3L8R9a1RdRaLQPA14dA1iw1bXol07B0i5ubC9vZr7TrTSItSvLr7On2t+33/wQn/a9/wCCZ/w/0Xx/+1p8Rv2XfBY8Xx+ID8PfBmlfFzVde8e/Em48KPoC+JbPwV4ft/BESajPoUfijQp9Tlvb7TbG0j1K0WW8E1zbxS/kJ4H8a+Kvht418IfEXwLrd94Z8beAfFGgeNPB3iPTJPJ1Lw/4p8Laraa54f1vT5SGEV7pWrWNpfWshVgk8EbEEDFf6VX/AAVe8P8Ahf8A4Lwf8G73w6/bq+FujWVz8bPgb4ST9ottB0dDPe6D4j+H9ld+EP2tfhXCC0+oJplpY6Z4k8WaHavANQ8S/wDCC+ArqGJINWhdgD+FX9ir/gmB8WP28fDXjjXvg58df2T/AA5qXwx8B+M/it8R/Bnxc+MV38OvFvgf4V+AbqwtfFPxJ8Qwaj4QudDt/BulHU9PuLzV4NduRZWt5BPqEVmr18F/EbwbD8PvG3iLwZb+MvBXxCh8P3wsk8Z/DnVL/W/BOv8A+jwzteeHdV1PSdDvr6xVpjbmefSrMtcQTCNHiCSyfqP4Dvj+yH/wSb+JfjyNzp3xm/4KgfEOT4E+CplJh1TSP2M/2a/EGi+L/jdrlncwYnt9N+Mn7QLfDv4cFJnWHVtO+Dfj/TgrwpdpJ+QdABX9wH/Bmv8At+2PhX4t/Gz/AIJo/FLUbW78D/tA6Vq/xd+C+k62YrjS3+Jfhfw+lh8VPBcVjc+ZDdf8LA+F+nW3iKW1ljFmsPwu1KNle41krL/D/XX+AvH/AI2+Fvi/QviB8OPFWveCPG/hi7a/8PeKvDOpXWj67o148E1rJcafqNnJFcW0ktrcXFtL5bgS2880EgaKR1YA/QX/AIK2/HP4U/F79sjxh4J/ZvtI9J/ZM/Zb0q0/ZZ/ZY0W2vpNSsk+E3wp1TWYrvxbBqEjF9Sl+K3xH1fx78W7rU5UiubyXxz/pMavEFX8y6KKAP//Z
[viem-url]: https://viem.sh/
[prettier]: https://img.shields.io/badge/Prettier-360D3A?style=for-the-badge&logo=Prettier&logoColor=61DAFB
[prettier-url]: https://prettier.io/
[eslint]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=61DAFB
[eslint-url]: https://eslint.org/
