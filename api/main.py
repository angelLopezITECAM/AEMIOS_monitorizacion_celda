from fastapi import FastAPI
from routes.mqtt import router as router_mqtt
from routes.influx import router as router_influx
from middlewares.cors import add as add_cors
from services.mqtt import start_mqtt_client

app = FastAPI(title="API con MQTT e InfluxDB", version="1.0.0")

# Incluimos los endpoints de comandos
app.include_router(router_mqtt, prefix="/api/mqtt")
app.include_router(router_influx, prefix="/api/influx")

add_cors(app)

@app.on_event("startup")
def startup_event():
    # Iniciar el cliente MQTT
    start_mqtt_client()
    print("Aplicación iniciada y cliente MQTT conectado.")

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API"}
