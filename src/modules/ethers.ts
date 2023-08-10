import Module from './base';
import { ethers } from 'ethers';
import { InputFacet__factory, InputFacet } from '@cartesi/rollups';
import { JsonRpcProvider } from '@ethersproject/providers';

import dotenv from 'dotenv';
dotenv.config();

const ALCHEMY_API_KEY = String(process.env.ALCHEMY_API_KEY);
const PRIVATE_KEY = String(process.env.PRIVATE_KEY);
const CHAIN_ID = 80001; // Chain ID for Matic Mumbai testnet
const MNEMONIC = String(process.env.MNEMONIC);
const DAPP_ADDRESS = String(process.env.DAPP_ADDRESS);

export default class Ethers extends Module {
	constructor() {
		super('Ethers');
	}

	public async init(): Promise<void> {}

	public async destroy(): Promise<void> {
		// Nothing to do here
	}
}

class CartesiDapp {
	inputContract: InputFacet;

	constructor() {
		const provider = new JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);

		const wallet = ethers.Wallet.fromMnemonic(MNEMONIC, "m/44'/60'/0'/0/0").connect(provider);
		this.inputContract = InputFacet__factory.connect(DAPP_ADDRESS, wallet);
	}

	public async sendInput(data: string): Promise<void> {
		const inputBytes = ethers.utils.isBytesLike(data) ? data : ethers.utils.toUtf8Bytes(data);
		const tx = await this.inputContract.addInput(inputBytes);

		console.log(`[CartesiDapp] Transaction sent to ${tx.to}, with data: ${tx.data}, from ${tx.from}`);

		console.log('waiting for confirmation...');
		const receipt = await tx.wait(1);

		const event = receipt.events?.find((e) => e.event === 'InputAdded');

		console.log(`[CartesiDapp] Input added => epoch : ${event?.args?.epochNumber} index: ${event?.args?.inputIndex}`);

		console.log(`[CartesiDapp] Transaction confirmed in block ${receipt.blockNumber}`);
	}
}

export { CartesiDapp };
