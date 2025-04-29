# app/mqtt/client.py

import threading
import paho.mqtt.client as mqtt
from constantes.config import MQTT_BROKER, MQTT_PORT, COMMAND_TOPIC, DATA_TOPIC, ALARMS_TOPIC, STATUS_TOPIC
import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo
import json
from fastapi import WebSocket

class MQTTClient:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(MQTTClient, cls).__new__(cls)
                cls._instance._initialize()
            return cls._instance

    def _initialize(self):
        self.client = mqtt.Client()
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.active_connections: list[WebSocket] = []
        self.mqtt_messages = asyncio.Queue(maxsize=100)

    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Conectado al Broker MQTT exitosamente.")
            topics = [(COMMAND_TOPIC, 0), (DATA_TOPIC, 0), (ALARMS_TOPIC, 0), (STATUS_TOPIC, 0)]
            client.subscribe(topics)
            print(f"Suscrito a los tópicos: {[topic[0] for topic in topics]}")
        else:
            print(f"Error al conectar al Broker MQTT, código de retorno: {rc}")

    def _on_message(self, client, userdata, msg):
        try:
            mensaje = msg.payload.decode()
            print(f"Mensaje recibido del tópico {msg.topic}: {mensaje}")

            try:
                data = json.loads(mensaje)
                message_data = {
                    "topic": msg.topic,
                    "payload": data,
                    "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat(),
                    "process": False
                }
            except json.JSONDecodeError:
                message_data = {
                    "topic": msg.topic,
                    "payload": mensaje,
                    "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat(),
                    "process": False
                }

            print(f"Procesando mensaje: {message_data}")

            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

            # Agregar el mensaje a la cola
            loop.run_until_complete(self.mqtt_messages.put(message_data))
            print(f"Mensaje agregado a la cola. Tamaño actual: {self.mqtt_messages.qsize()}")

            # Broadcast a WebSockets
            loop.run_until_complete(self._broadcast_message(message_data))
            print(f"Mensaje procesado y enviado a WebSocket")

        except Exception as e:
            print(f"Error al procesar mensaje: {e}")
            import traceback
            print(f"Traceback completo: {traceback.format_exc()}")

    async def _broadcast_message(self, message: dict):
        print(f"Intentando broadcast a {len(self.active_connections)} conexiones")
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
                print(f"Mensaje enviado exitosamente a una conexión WebSocket")
            except Exception as e:
                print(f"Error al enviar mensaje a WebSocket: {e}")
                disconnected.append(connection)
                print(f"Conexión WebSocket marcada para remover. Error: {e}")

        # Remover conexiones desconectadas
        for conn in disconnected:
            if conn in self.active_connections:
                self.active_connections.remove(conn)
                print(f"Conexión WebSocket removida. Conexiones restantes: {len(self.active_connections)}")

    def connect(self):
        try:
            # Configurar reconexión antes de conectar
            self.client.reconnect_delay_set(min_delay=1, max_delay=120)
            self.client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
            print(f"Conectado al broker MQTT: {MQTT_BROKER}:{MQTT_PORT}")
        except Exception as e:
            print(f"No se pudo conectar al broker MQTT: {e}")
            import traceback
            print(f"Traceback completo: {traceback.format_exc()}")

    def start(self):
        try:
            self.client.loop_start()
            print("Loop MQTT iniciado.")
            print(f"Estado de conexión: {'Conectado' if self.client.is_connected() else 'Desconectado'}")
        except Exception as e:
            print(f"Error al iniciar el loop MQTT: {e}")
            import traceback
            print(f"Traceback completo: {traceback.format_exc()}")

    async def publish(self, topic: str, message: dict):
        try:
            message_str = json.dumps(message)
            print(f"Intentando publicar en MQTT - Topic: {topic}, Mensaje: {message_str}")
            
            result = self.client.publish(topic, message_str)
            print(f"Resultado de la publicación: {result}")
            
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(f"Mensaje publicado exitosamente en {topic}")
                await asyncio.sleep(0.3)
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

    async def connect_websocket(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Nueva conexión WebSocket. Total conexiones: {len(self.active_connections)}")
        
        try:
            # Enviar mensajes acumulados en la cola
            while not self.mqtt_messages.empty():
                try:
                    message = await self.mqtt_messages.get()
                    await websocket.send_json(message)
                    print(f"Mensaje histórico enviado a WebSocket: {message}")
                except Exception as e:
                    print(f"Error al enviar mensaje histórico: {e}")
                    break

            # Mantener la conexión abierta y escuchar nuevos mensajes
            while True:
                try:
                    data = await websocket.receive_json()
                    print(f"Mensaje recibido en WebSocket: {data}")

                    if "topic" in data and "message" in data:
                        success = await self.publish(data["topic"], data["message"])
                        
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
                    continue
                except Exception as e:
                    print(f"Error en conexión WebSocket: {e}")
                    break
        finally:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
            print(f"Conexión WebSocket cerrada. Total conexiones: {len(self.active_connections)}")

# Crear una única instancia global
mqtt_client = MQTTClient()
