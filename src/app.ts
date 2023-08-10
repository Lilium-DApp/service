import express, { Express } from 'express';
import ModuleManager, { MQTT, Ethers, CartesiDapp } from './modules';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Constants for server
const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || '0.0.0.0';

// Create Express app instance
const app: Express = express();

// Create ModuleManager instance and add modules
const moduleManager: ModuleManager = new ModuleManager();

const mqttModule: MQTT = new MQTT();
moduleManager.addModule(mqttModule);

const ethersModule: Ethers = new Ethers();
const cartesiDapp: CartesiDapp = new CartesiDapp();
moduleManager.addModule(ethersModule);

// Init all modules
moduleManager.init();

// Middleware for parsing JSON request body
app.use(express.json());

// Middleware for CORS
app.use(
	cors({
		origin: '*',
	})
);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

// Cartesi send input endpoint
app.post('/send-input', async (req, res) => {
	const data = req.body.data;
	await cartesiDapp.sendInput(data);

	res.send('Input sent');
});

// Get latest data endpoint
app.get('/latest-data', async (req, res) => {
	res.send(mqttModule.getLatestData());
});

// Start server, the "+" is to convert the string to a number ( Trick to avoid type errors )
// You can find more info about this here: https://stackoverflow.com/questions/14667713/how-to-convert-a-string-to-number-in-typescript
app.listen(+PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);

	mqttModule.addTopic('temperature'); // Add topic for contract address (test contract)
	mqttModule.addTopic('humidity'); // Add topic for contract address (test contract)
	mqttModule.setCallback((topic, payload) => {
		console.log(`[MQTT] Message received on topic ${topic}: ${payload.toString()}`);
	});
});
