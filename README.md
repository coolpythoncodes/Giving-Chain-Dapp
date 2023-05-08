
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

![](https://img.shields.io/badge/Hackathon-blueviolet)

[![Contributors][contributors-shield]][contributors-url]
[![GitHub issues][issues-shield]][issues-url]
[![GitHub forks][forks-shield]][forks-url]
[![GitHub stars][star-shield]][star-url]
[![GitHub license][license-shield]][license-url]



# Giving Chain 

> A decentralized crowdfunding and charity Dapp on BNB chain

#### **N/B**: All PRs should be made to the [staging](https://github.com/coolpythoncodes/Giving-Chain-Dapp/tree/staging) branch


This project was bootstrapped with [`create-t3-app`](https://create.t3.gg/).

## Technology Stack & Tools

- React
- NextJS
- Hardhat
- Particle network for social login authentication and wallet functionalities


### Install
```bash
git clone https://github.com/coolpythoncodes/Giving-Chain-Dapp

yarn install

# create a particle network project from https://dashboard.particle.network/#/project/all 
# to get PROJECT_ID, CLIENT_KEY, and APP_ID

- Copy `.env.example` to a new `.env` file on Giving-Chain-Dapp root folder
- Copy `secret.example.json` to a new `secret.json` // ensure you don't expose this to the public
cd Giving-Chain-Dapp

#Get your web development server running.
yarn dev

# compile the contract at the root directory
npx hardhat compile

# deploy to bsc testnet
yarn deploy-testnet

```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

## Show your support

Give a ⭐ if you like this project!

## Useful links

- [BNB Faucet](https://testnet.bnbchain.org/faucet-smart)
- [Particle network](https://particle.network/)
- [BSC scan api key](https://bscscan.com/myapikey)
- [Verified Giving Chain Token address on BSC scan](https://testnet.bscscan.com/address/0x7bcc9c9ec80b96e6a92287e2333f78490b0570c4#code)
- [Verified Crowd Fund address on BSC scan](https://testnet.bscscan.com/address/0x80B67a86fada64DCeE4153E5d57b7e2E599aA810#code)

[contributors-shield]: https://img.shields.io/github/contributors/coolpythoncodes/Giving-Chain-Dapp?style=for-the-badge
[contributors-url]: https://github.com/coolpythoncodes/Giving-Chain-Dapp/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/coolpythoncodes/Giving-Chain-Dapp?style=for-the-badge
[issues-url]: https://github.com/coolpythoncodes/Giving-Chain-Dapp/issues
[forks-shield]: https://img.shields.io/github/forks/coolpythoncodes/Giving-Chain-Dapp?style=for-the-badge
[forks-url]: https://github.com/coolpythoncodes/Giving-Chain-Dapp/network
[star-shield]: https://img.shields.io/github/stars/coolpythoncodes/Giving-Chain-Dapp?style=for-the-badge
[star-url]: https://github.com/coolpythoncodes/Giving-Chain-Dapp/stargazers
[license-shield]: https://img.shields.io/github/license/coolpythoncodes/Giving-Chain-Dapp?style=for-the-badge
[license-url]: https://github.com/coolpythoncodes/Giving-Chain-Dapp/blob/main/LICENSE.md
