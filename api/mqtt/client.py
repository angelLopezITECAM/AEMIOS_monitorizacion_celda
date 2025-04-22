# app/mqtt/client.py

import threading
import paho.mqtt.client as mqtt
from constantes.config import MQTT_BROKER, MQTT_PORT
from services.mqtt import on_connect, on_message
import time

# Inicializamos el cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# Configuración de reconexión automática
mqtt_client.reconnect_delay_set(min_delay=1, max_delay=120)

def connect_mqtt():
    try:
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        print("Conectado al broker MQTT:", MQTT_BROKER)
    except Exception as e:
        print("No se pudo conectar al broker MQTT:", e)

def mqtt_loop():
    while True:
        try:
            mqtt_client.loop_forever()
        except Exception as e:
            print(f"Error en el loop MQTT: {e}")
            time.sleep(5)  # Esperar antes de reintentar
            try:
                mqtt_client.reconnect()
            except:
                print("No se pudo reconectar al broker MQTT")

def start_mqtt_loop():
    mqtt_client.loop_start()
    print("Loop MQTT iniciado.")
