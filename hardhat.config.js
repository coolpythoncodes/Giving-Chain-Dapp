require("@nomicfoundation/hardhat-toolbox");
const { mnemonic, bscscanApiKey } = require("./secret.json");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: "testnet",
	networks: {
		localhost: {
			url: "http://127.0.0.1:8545"
		},
		hardhat: {},
		testnet: {
			url: "https://data-seed-prebsc-1-s1.binance.org:8545",
			chainId: 97,
			gasPrice: 20000000000,
			accounts: { mnemonic: mnemonic }
		}
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://bscscan.com/
		apiKey: bscscanApiKey
	},
	solidity: {
		version: "0.8.18",
		settings: {
			optimizer: {
				enabled: true
			}
		}
	},
	paths: {
		sources: "./contracts",
		tests: "./test",
		cache: "./cache",
		artifacts: "./artifacts"
	},
	mocha: {
		timeout: 20000
	}
};

