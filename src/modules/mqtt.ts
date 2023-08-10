import Module from './base';
import mqtt, { Client, IPublishPacket } from 'mqtt';

import dotenv from 'dotenv';
dotenv.config();

const SERVER = String(process.env.BROKER_SERVER);
const PORT = Number(process.env.BROKER_PORT); // Use Number instead of '+' to convert to number because BROKER_PORT can be undefined
const USERNAME = String(process.env.BROKER_USER);
const PASSWORD = String(process.env.BROKER_PASSWORD);

export default class MQTT extends Module {
	private client: Client;
	private callback!: (topic: string, payload: Buffer) => void;
	private latestData: any = {};

	constructor() {
		super('MQTT');
		this.client = mqtt.connect(SERVER, {
			port: PORT,
			username: USERNAME,
			password: PASSWORD,
			protocol: 'mqtts',
		});

		this.latestData = {
			temperature: 0,
			humidity: 0,
		};
	}

	public getLatestData(): any {
		return this.latestData;
	}

	private messageHandler(topic: string, payload: Buffer, _packet: IPublishPacket): void {
		//console.log(`[MQTT] Message received on topic ${topic}: ${payload.toString()}`);

		if (topic === 'temperature') {
			this.latestData.temperature = payload.toString();
		} else if (topic === 'humidity') {
			this.latestData.humidity = payload.toString();
		}

		if (this.callback) {
			this.callback(topic, payload);
		}
	}

	private connectHandler(): void {
		console.log('[MQTT] Connected');
	}

	private errorHandler(error: Error): void {
		console.error('[MQTT] Error:', error);
		this.client.end();
	}

	// For the CarBon project, each topic is a address of contract / device identifier for receveive data
	public addTopic(topic: string): void {
		this.client.subscribe(topic, (error) => {
			if (error) {
				console.error('[MQTT] Error:', error);
			} else {
				console.log(`[MQTT] Subscribed to topic ${topic}`);
			}
		});
	}

	public setCallback(callback: (topic: string, payload: Buffer) => void): void {
		this.callback = callback;
	}

	public init(): void {
		this.client.on('connect', this.connectHandler);
		this.client.on('error', this.errorHandler);
		this.client.on('message', this.messageHandler.bind(this));
	}

	public destroy(): void {
		console.log('[MQTT] Destroying');
		this.client.end();
	}
}
