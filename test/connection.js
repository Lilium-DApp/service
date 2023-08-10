const ethers = require("ethers");
const lastMessages = require("./mqtt.js");
const abi = require("./abi.js");

const alchemyEndpoint = `https://eth-sepolia.g.alchemy.com/v2/f3AqMU2ObpHYDIV1EmPHrswN2GW1zjzF`;

const provider = new ethers.providers.JsonRpcProvider(alchemyEndpoint);

const privateKey = "8bd29fbdadfa141c6f1dc175b8b5a6f59c976fc71778425e33e04b4d5adce80e"; // Replace with your private key
const wallet = new ethers.Wallet(privateKey, provider);

const signer = wallet.connect(provider);

const contractAddress = "0x1DeB97C2F7323Fd6A34eB5B20079733Bee77A787";
const contractABI = abi.abi;

const contract = new ethers.Contract(contractAddress, contractABI, provider);
const contractWithSigner = contract.connect(signer);

function fetchDataEveryHour() {

  setInterval(async () => {
    try {
      const txResponse = await contractWithSigner.verifyRealWorldState(JSON.stringify(lastMessages));

      console.log("Transaction hash:", txResponse.hash);
      await txResponse.wait(); 
      console.log("Transaction confirmed in block:", txResponse.blockNumber);
    } catch (error) {
      console.error("Error:", error);
    }
  }, 1000 * 5); // One hour in milliseconds
}

// Call the function to start fetching data every hour
fetchDataEveryHour();
