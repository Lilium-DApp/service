const mqtt = require("mqtt");
const base64_img = require("./image.js");

const client = mqtt.connect(
  "mqtts://6de8943d63b944c894df708f4ee73e4a.s1.eu.hivemq.cloud",
  {
    username: "lilium-blockchain",
    password: "lilium@Lux314159",
    port: 8883,
    reconnectPeriod: 5000, // Try reconnecting in 5 seconds if connection is lost
  }
);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("Lilium/humidity", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
  client.subscribe("Lilium/temperature", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
  client.subscribe("Lilium/CO", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
});

const lastMessages = {
  base64: base64_img,
  co: null,
  humidity: null,
  temperature: null,
};

client.on("message", (topic, message) => {
  if (topic === "Lilium/CO") {
    lastMessages.co = message.toString();
  } else if (topic === "Lilium/humidity") {
    lastMessages.humidity = message.toString();
  } else if (topic === "Lilium/temperature") {
    lastMessages.temperature = message.toString();
  }
});

module.exports = lastMessages;
