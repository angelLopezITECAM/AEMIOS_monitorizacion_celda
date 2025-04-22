
import os
from dotenv import load_dotenv
load_dotenv()

# Configuración de MQTT
MQTT_BROKER = os.getenv("MQTT_BROKER", "mqtt")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
COMMAND_TOPIC = os.getenv("COMMAND_TOPIC", "devices/data")
DATA_TOPIC = os.getenv("DATA_TOPIC", "devices/play")
ALARMS_TOPIC = os.getenv("DATA_TOPIC", "devices/alarms")
STATUS_TOPIC = os.getenv("STATUS_TOPIC", "devices/status")

# Configuración de InfluxDB
INFLUXDB_HOST = os.getenv("INFLUXDB_HOST", "influxdb")
INFLUXDB_PORT = os.getenv("INFLUXDB_PORT", "8086")
INFLUXDB_DATABASE = os.getenv("INFLUXDB_DATABASE", "aemios_celda")
