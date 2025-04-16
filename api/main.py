
from fastapi import FastAPI
from mqtt.client import connect_mqtt, start_mqtt_loop

from routes.mqtt import router as router_mqtt
from routes.influx import router as router_influx

from middlewares.cors import add as add_cors


# Añadimos el middleware CORS



app = FastAPI(title="API con MQTT e InfluxDB", version="1.0.0")

# Incluimos los endpoints de comandos
app.include_router(router_mqtt, prefix="/api/mqtt")
app.include_router(router_influx, prefix="/api/influx")

add_cors(app)

@app.on_event("startup")
def startup_event():
    # Conectar al broker MQTT y arrancar el loop en un hilo separado
    connect_mqtt()
    start_mqtt_loop()
    print("Aplicación iniciada y conectada al Broker MQTT.")

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API"}
