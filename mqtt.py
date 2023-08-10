import paho.mqtt.client as mqtt
from image import image
import threading
from dotenv import load_dotenv
import os

load_dotenv()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe("Lilium/humidity")
        client.subscribe("Lilium/temperature")
        client.subscribe("Lilium/CO")
    else:
        print("Connection failed")

def on_message(client, userdata, msg):
    topic = msg.topic
    message = msg.payload.decode("utf-8")
    if topic == "Lilium/CO":
        lastMessages["co"] = message
    elif topic == "Lilium/humidity":
        lastMessages["humidity"] = message
    elif topic == "Lilium/temperature":
        lastMessages["temperature"] = message

broker_address = os.environ["BROKER"]
username = os.environ["USER"]
password = os.environ["PASSWORD"]
port = os.environ["PORT"]
reconnect_period = 5  # seconds

lastMessages = {
    "base64": image,
    "co": None,
    "humidity": None,
    "temperature": None
}


def run_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.username_pw_set(username, password)
    client.tls_set()

    client.connect(broker_address, port, keepalive=reconnect_period)

    client.loop_forever()  # Start the MQTT loop

# Create and start the thread for MQTT
mqtt_thread = threading.Thread(target=run_mqtt)
mqtt_thread.start()