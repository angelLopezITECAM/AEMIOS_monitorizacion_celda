import json
import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo
from constantes.config import DATA_TOPIC, COMMAND_TOPIC, ALARMS_TOPIC, STATUS_TOPIC, MQTT_BROKER, MQTT_PORT
from fastapi import WebSocket
from mqtt.client import mqtt_client

# Cola asíncrona para los mensajes MQTT
mqtt_messages = mqtt_client.mqtt_messages

# Lista de conexiones WebSocket activas
active_connections = mqtt_client.active_connections

async def broadcast_message(message: dict):
    """Envía un mensaje a todos los clientes WebSocket conectados"""
    await mqtt_client._broadcast_message(message)

async def publish_to_mqtt(topic: str, message: dict):
    """Publica un mensaje en el broker MQTT"""
    try:
        # Convertir el mensaje a JSON string
        message_str = json.dumps(message)
        print(f"Intentando publicar en MQTT - Topic: {topic}, Mensaje: {message_str}")
        
        # Publicar el mensaje usando el cliente global
        result = await mqtt_client.publish(topic, message)
        print(f"Resultado de la publicación: {result}")
        
        # Verificar el resultado de la publicación
        if result:
            print(f"Mensaje publicado exitosamente en {topic}")
            # Esperar un momento para asegurar que el mensaje se procese
            await asyncio.sleep(0.3)
            return True
        else:
            error_msg = f"Error al publicar mensaje en {topic}"
            print(error_msg)
            return False
            
    except Exception as e:
        print(f"Error detallado al publicar en MQTT: {str(e)}")
        print(f"Tipo de error: {type(e).__name__}")
        import traceback
        print(f"Traceback completo: {traceback.format_exc()}")
        return False

async def connect_websocket(websocket: WebSocket):
    """Maneja una nueva conexión WebSocket"""
    await mqtt_client.connect_websocket(websocket)

def start_mqtt_client():
    try:
        # Iniciar el cliente MQTT
        mqtt_client.connect()
        mqtt_client.start()
        print("Cliente MQTT iniciado y conectado")
        
        # Verificar la conexión
        if mqtt_client.client.is_connected():
            print("Conexión MQTT establecida exitosamente")
        else:
            print("Advertencia: Cliente MQTT iniciado pero no conectado")
            
    except Exception as e:
        print(f"Error al iniciar el cliente MQTT: {e}")
        import traceback
        print(f"Traceback completo: {traceback.format_exc()}")