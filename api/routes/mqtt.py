# app/api/endpoints/commands.py

import json
import asyncio
import queue
from fastapi import APIRouter, HTTPException
from typing import List
from mqtt.client import mqtt_client
from entidades.schemas.mqtt_message import MqttMessage
from services.mqtt import mqtt_messages
from sse_starlette.sse import EventSourceResponse
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from mqtt.client import connect_mqtt, start_mqtt_loop

router = APIRouter()

@router.post("/publish", tags=["Comandos"])
async def publish_message(message: MqttMessage):
    json_payload = json.dumps(message.message)
    result = mqtt_client.publish(message.topic, json_payload)
    if result[0] == 0:
        return {"status": "Comando enviado exitosamente"}
    else:
        raise HTTPException(status_code=500, detail="Error al publicar en el topic {topic}: {result}")

@router.get("/stream")
async def mqtt_stream():
    """
    Endpoint SSE que transmite mensajes MQTT al cliente en tiempo real
    """
    messages = []
        # Vaciamos la cola de mensajes y los agregamos a la lista
    while not mqtt_messages.empty():
        messages.append(mqtt_messages.get())
    return JSONResponse({"messages": messages})

@router.websocket("/ws")
async def websocket_mqtt_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Nueva conexión WebSocket aceptada")
    
    # Bandera para controlar el bucle principal
    is_connected = True
    
    try:
        # Enviar mensaje inicial de conexión exitosa
        await websocket.send_text(json.dumps({
            "type": "connection",
            "status": "connected",
            "timestamp": datetime.now().isoformat()
        }))
        
        # Bucle principal para recibir y enviar mensajes
        while is_connected:
            # 1. Manejar mensajes entrantes (cliente -> servidor)
            try:
                # Intenta recibir un mensaje sin bloquear (con timeout)
                text = await asyncio.wait_for(
                    websocket.receive_text(), 
                    timeout=0.1  # Timeout corto para no bloquear la ejecución
                )
                
                # Procesar el mensaje recibido
                try:
                    data = json.loads(text)
                    print(f"Mensaje recibido desde cliente: {data}")
                    
                    # Si el mensaje tiene topic y mensaje, publicarlo en MQTT
                    if "topic" in data and "message" in data:
                        topic = data["topic"]
                        message = data["message"]
                        
                        # Convertir mensaje a JSON string si es un objeto
                        if isinstance(message, dict):
                            message_json = json.dumps(message)
                        else:
                            message_json = str(message)
                        
                        # Publicar en MQTT
                        result = mqtt_client.publish(topic, message_json)
                        
                        # Enviar confirmación al cliente
                        if result[0] == 0:
                            await websocket.send_text(json.dumps({
                                "type": "publish_response",
                                "status": "success",
                                "topic": topic,
                                "timestamp": datetime.now().isoformat()
                            }))
                        else:
                            await websocket.send_text(json.dumps({
                                "type": "publish_response",
                                "status": "error",
                                "topic": topic,
                                "error": f"Error de publicación: {result}",
                                "timestamp": datetime.now().isoformat()
                            }))
                    else:
                        # Si el formato del mensaje no es el esperado
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Formato incorrecto. Se esperaba {topic, message}",
                            "timestamp": datetime.now().isoformat()
                        }))
                        
                except json.JSONDecodeError:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "El mensaje no es un JSON válido",
                        "timestamp": datetime.now().isoformat()
                    }))
                except Exception as e:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Error al procesar mensaje: {str(e)}",
                        "timestamp": datetime.now().isoformat()
                    }))
                    
            except asyncio.TimeoutError:
                # Timeout normal, continúa con la siguiente parte
                pass
            except WebSocketDisconnect:
                # Si detectamos desconexión aquí, terminamos el bucle
                is_connected = False
                print("Cliente desconectado del WebSocket")
                break
            except Exception as e:
                print(f"Error al recibir mensaje: {e}")
                if "disconnect" in str(e).lower():
                    is_connected = False
                    print("Cliente desconectado (detectado por excepción)")
                    break
            
            # 2. Enviar mensajes MQTT al cliente (servidor -> cliente)
            try:
                while not mqtt_messages.empty() and is_connected:
                    message = mqtt_messages.get()
                    await websocket.send_text(json.dumps(message))
            except Exception as e:
                print(f"Error al enviar mensajes MQTT: {e}")
                is_connected = False
                break
            
            # Pausa breve para no saturar la CPU
            await asyncio.sleep(0.2)
            
    except WebSocketDisconnect:
        print("Cliente desconectado del WebSocket (excepción principal)")
    except Exception as e:
        print(f"Error en WebSocket: {str(e)}")
    finally:
        print("Conexión WebSocket finalizada")

@router.get("/messages", response_model=List[dict])
async def get_recent_messages():
    """
    Obtiene los mensajes MQTT más recientes (para cuando el cliente se conecta)
    """
    messages = []
    # Hacer una copia temporal de los mensajes sin vaciar la cola
    temp_queue = queue.Queue()
    
    while not mqtt_messages.empty():
        msg = mqtt_messages.get()
        messages.append(msg)
        temp_queue.put(msg)
    
    # Restaurar los mensajes a la cola original
    while not temp_queue.empty():
        mqtt_messages.put(temp_queue.get())
    
    return messages
