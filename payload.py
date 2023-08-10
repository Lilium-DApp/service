from web3 import Web3
from web3.middleware import construct_sign_and_send_raw_middleware
from web3.gas_strategies.time_based import fast_gas_price_strategy
from dotenv import load_dotenv
import os

load_dotenv()


def send_input():
    print("Sending input")
    # Setup connection to the provider
    w3 = Web3(Web3.HTTPProvider(os.environ["PROVIDER"]))

    acct_0 = w3.eth.account.from_key(os.environ["PRIVATE_KEY"])

    w3.middleware_onion.add(construct_sign_and_send_raw_middleware(acct_0))
    w3.eth.set_gas_price_strategy(fast_gas_price_strategy)

    input_contract = w3.eth.contract(
        address="0x0D20b3105D6DB2f116AE79e73a6123F83684399E",
        abi=[
            {
                "inputs": [
                    {"internalType": "string", "name": "statement", "type": "string"}
                ],
                "name": "verifyRealWorldState",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [],
                "name": "payload",
                "outputs": [{"internalType": "bytes", "name": "", "type": "bytes"}],
                "stateMutability": "view",
                "type": "function",
            },
        ],
    )

    payload = input_contract.functions.payload().call()
    print(payload)


send_input()
