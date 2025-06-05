from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from routes.mqtt import router as router_mqtt
from routes.influx import router as router_influx
from services.mqtt import publish_to_mqtt, connect_websocket, start_mqtt_client
from mqtt.client import mqtt_client
import asyncio
import json
from datetime import datetime
from zoneinfo import ZoneInfo
from services.email import crear_mensaje, enviar
from pydantic import BaseModel

app = FastAPI(title="API con MQTT e InfluxDB", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers
app.include_router(router_mqtt, prefix="/api/mqtt", tags=["MQTT"])
app.include_router(router_influx, prefix="/api/influx", tags=["InfluxDB"])

@app.on_event("startup")
async def startup_event():
    # Iniciar el cliente MQTT
    start_mqtt_client()

@app.websocket("/api/mqtt/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connect_websocket(websocket)

@app.get("/")
async def root():
    return {"message": "API de monitoreo MQTT"}

class EmailSchema(BaseModel):
    msg: str
@app.post("/send-mail-alarm")
async def send_mail(data: EmailSchema):
    destinatarios = "angel.lopez@itecam.com"
    msg = data.msg
    enviar(destinatarios, crear_mensaje(msg))
    return {"message": "Correo enviado exitosamente"}

@app.post("/publish")
async def publish_message(topic: str, message: dict):
    success = await publish_to_mqtt(topic, message)
    return {"success": success}
