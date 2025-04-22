import json
import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo
from constantes.config import DATA_TOPIC, COMMAND_TOPIC, ALARMS_TOPIC, STATUS_TOPIC, MQTT_BROKER, MQTT_PORT
from fastapi import WebSocket
import paho.mqtt.client as mqtt

# Cola asíncrona para los mensajes MQTT
mqtt_messages = asyncio.Queue(maxsize=100)

# Lista de conexiones WebSocket activas
active_connections: list[WebSocket] = []

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado al Broker MQTT exitosamente.")
        # Suscribirse a todos los tópicos
        topics = [(COMMAND_TOPIC, 0), (DATA_TOPIC, 0), (ALARMS_TOPIC, 0), (STATUS_TOPIC, 0)]
        client.subscribe(topics)
        print(f"Suscrito a los tópicos: {[topic[0] for topic in topics]}")
    else:
        print(f"Error al conectar al Broker MQTT, código de retorno: {rc}")

async def broadcast_message(message: dict):
    """Envía un mensaje a todos los clientes WebSocket conectados"""
    for connection in active_connections:
        try:
            await connection.send_json(message)
        except Exception as e:
            print(f"Error al enviar mensaje a WebSocket: {e}")
            # Remover conexiones muertas
            if connection in active_connections:
                active_connections.remove(connection)

def on_message(client, userdata, msg):
    try:
        mensaje = msg.payload.decode()
        print(f"Mensaje recibido del tópico {msg.topic}: {mensaje}")

        # Procesar el mensaje para el streaming
        try:
            data = json.loads(mensaje)
            message_data = {
                "topic": msg.topic,
                "payload": data,
                "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat(),
                "process": False  # Añadimos esta bandera para el frontend
            }
        except json.JSONDecodeError:
            message_data = {
                "topic": msg.topic,
                "payload": mensaje,
                "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat(),
                "process": False  # Añadimos esta bandera para el frontend
            }

        # Crear un nuevo event loop para este hilo
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        # Ejecutar las tareas asíncronas
        loop.run_until_complete(asyncio.gather(
            mqtt_messages.put(message_data),
            broadcast_message(message_data)
        ))
        
        print(f"Mensaje procesado y enviado a WebSocket")

    except Exception as e:
        print(f"Error al procesar mensaje: {e}")
        import traceback
        print(f"Traceback completo: {traceback.format_exc()}")

# Cliente MQTT global
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

async def publish_to_mqtt(topic: str, message: dict):
    """Publica un mensaje en el broker MQTT"""
    try:
        # Convertir el mensaje a JSON string
        message_str = json.dumps(message)
        print(f"Intentando publicar en MQTT - Topic: {topic}, Mensaje: {message_str}")
        
        # Publicar el mensaje usando el cliente global
        result = mqtt_client.publish(topic, message_str)
        print(f"Resultado de la publicación: {result}")
        
        # Verificar el resultado de la publicación
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            print(f"Mensaje publicado exitosamente en {topic}")
            # Esperar un momento para asegurar que el mensaje se procese
            await asyncio.sleep(0.1)
            return True
        else:
            error_msg = f"Error al publicar mensaje en {topic}. Código de error: {result.rc}"
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
    await websocket.accept()
    active_connections.append(websocket)
    print(f"Nueva conexión WebSocket. Total conexiones: {len(active_connections)}")
    
    try:
        while True:
            try:
                # Recibir mensaje del WebSocket
                data = await websocket.receive_json()
                print(f"Mensaje recibido en WebSocket: {data}")

                # Verificar que el mensaje tiene el formato correcto
                if "topic" in data and "message" in data:
                    # Publicar en MQTT
                    success = await publish_to_mqtt(data["topic"], data["message"])
                    
                    # Enviar confirmación al cliente
                    await websocket.send_json({
                        "type": "publish_response",
                        "success": success,
                        "topic": data["topic"],
                        "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat()
                    })
                else:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Formato de mensaje incorrecto. Se requiere {topic, message}",
                        "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat()
                    })
            except asyncio.TimeoutError:
                # Timeout normal, continuar
                continue
            except Exception as e:
                print(f"Error en conexión WebSocket: {e}")
                break
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)
        print(f"Conexión WebSocket cerrada. Total conexiones: {len(active_connections)}")

# Función para iniciar el cliente MQTT
def start_mqtt_client():
    try:
        # Configurar el cliente MQTT
        mqtt_client.reconnect_delay_set(min_delay=1, max_delay=120)
        
        # Intentar conectar
        print(f"Intentando conectar al broker MQTT en {MQTT_BROKER}:{MQTT_PORT}")
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        
        # Iniciar el loop en un hilo separado
        mqtt_client.loop_start()
        print("Cliente MQTT iniciado y conectado")
        
        # Verificar la conexión
        if mqtt_client.is_connected():
            print("Conexión MQTT establecida exitosamente")
        else:
            print("Advertencia: Cliente MQTT iniciado pero no conectado")
            
    except Exception as e:
        print(f"Error al iniciar el cliente MQTT: {e}")
        import traceback
        print(f"Traceback completo: {traceback.format_exc()}")