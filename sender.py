from web3 import Web3
from web3.middleware import construct_sign_and_send_raw_middleware
from web3.gas_strategies.time_based import fast_gas_price_strategy
from mqtt import lastMessages
import schedule
import time
import threading


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
    # Send the input
    tx = input_contract.functions.verifyRealWorldState(
        str(lastMessages)
    ).build_transaction(
        {
            "from": acct_0.address,
            "nonce": w3.eth.get_transaction_count(acct_0.address),
        }
    )

    sent = w3.eth.send_transaction(tx)
    print(repr(sent))

    # payload = input_contract.functions.payload().call()
    # print(payload)


# Schedule the function to run every 10 seconds
schedule.every(10).seconds.do(send_input)


def run_send_input():
    while True:
        schedule.run_pending()
        time.sleep(1)  # Sleep for a short time to avoid excessive CPU usage


# Create and start the thread for send_input
send_input_thread = threading.Thread(target=run_send_input)
send_input_thread.start()
