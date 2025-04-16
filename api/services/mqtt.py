import json
import queue
from datetime import datetime
from zoneinfo import ZoneInfo
from constantes.config import DATA_TOPIC, COMMAND_TOPIC, ALARMS_TOPIC
from services.influx import insertar

mqtt_messages = queue.Queue(maxsize=100)
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Conectado al Broker MQTT exitosamente.")
        client.subscribe(COMMAND_TOPIC)
        client.subscribe(DATA_TOPIC)
        client.subscribe(ALARMS_TOPIC)
    else:
        print("Error al conectar al Broker MQTT, código de retorno:", rc)

def on_message(client, userdata, msg):
    mensaje = msg.payload.decode()
    print(msg.topic)
    print(msg.topic)
    print(mensaje)
    print(mensaje)
    print(f"Mensaje recibido del tópico {msg.topic}: {mensaje}")

    if msg.topic == COMMAND_TOPIC:
        """ write_command_topic(mensaje) """
    elif msg.topic == DATA_TOPIC:
        """ write_data_topic(mensaje) """
        pass
    try:
        data = json.loads(mensaje)
        # Añadimos información adicional útil para el frontend
        message_data = {
            "topic": msg.topic,
            "payload": data,
            "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat()
        }
        # Si la cola está llena, sacamos el más antiguo
        if mqtt_messages.full():
            mqtt_messages.get()
        # Añadimos el nuevo mensaje
        mqtt_messages.put(message_data)
    except json.JSONDecodeError:
        # Si no es JSON válido, lo guardamos como texto
        message_data = {
            "topic": msg.topic,
            "payload": mensaje,
            "timestamp": datetime.now(ZoneInfo("Europe/Madrid")).isoformat()
        }
        if mqtt_messages.full():
            mqtt_messages.get()
        mqtt_messages.put(message_data)
    except Exception as e:
        print(f"Error al procesar mensaje para streaming: {e}")

    print(f"Tamaño actual de la cola: {mqtt_messages.qsize()}")

def write_command_topic(msg):
    try:
    # Se espera un JSON con la siguiente estructura:
    # { "device_id": "device-001", "measurement": "temperatura", "value": 24.5 }

        data = json.loads(msg)
        unidad_medida = data.get("ud", "desconocido")
        measurement = data.get("magnitude", "default")
        value = data.get("value", 0)

        # Se arma un diccionario para el punto de datos
        point = {
            "measurement": measurement,
            "tags": {
                "ud": unidad_medida
            },
            "fields": {
                "value": value
            },
            # Se utiliza la hora actual en formato ISO8601. Se añade "Z" para indicar UTC.
            "time": datetime.utcnow().isoformat() + "Z"
        }
        insertar(point)
        print("Datos escritos en InfluxDB correctamente.")
    except Exception as e:
        print("Error al procesar o escribir los datos en InfluxDB:", e)

def write_data_topic(msg):
    try:
    # Se espera un JSON con la siguiente estructura:
    # { "device_id": "device-001", "measurement": "temperatura", "value": 24.5 }
        data = json.loads(msg)
        unidad_medida = data.get("ud", "desconocido")
        measurement = data.get("element", "default")
        value = data.get("action", 0)

        # Se arma un diccionario para el punto de datos
        point = {
            "measurement": measurement,
            "tags": {
                "ud": unidad_medida
            },
            "fields": {
                "value": value
            },
            # Se utiliza la hora actual en formato ISO8601. Se añade "Z" para indicar UTC.
            "time": datetime.utcnow().isoformat() + "Z"
        }
        insertar(point)
        print("Datos escritos en InfluxDB correctamente.")
    except Exception as e:
        print("Error al procesar o escribir los datos en InfluxDB:", e)