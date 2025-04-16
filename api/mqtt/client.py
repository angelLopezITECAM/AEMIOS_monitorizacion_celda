# app/mqtt/client.py

import threading
import paho.mqtt.client as mqtt
from constantes.config import MQTT_BROKER, MQTT_PORT
from services.mqtt import on_connect, on_message
import asyncio

# Inicializamos el cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def connect_mqtt():
    try:
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        print("Conectado al broker MQTT:", MQTT_BROKER)
    except Exception as e:
        print("No se pudo conectar al broker MQTT:", e)

def start_mqtt_loop():
    thread = threading.Thread(target=mqtt_client.loop_forever)
    thread.daemon = True
    thread.start()
    print("Loop MQTT iniciado en hilo de fondo.")
