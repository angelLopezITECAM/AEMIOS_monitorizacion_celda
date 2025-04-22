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
from services.mqtt import connect_websocket

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
async def websocket_endpoint(websocket: WebSocket):
    await connect_websocket(websocket)

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
