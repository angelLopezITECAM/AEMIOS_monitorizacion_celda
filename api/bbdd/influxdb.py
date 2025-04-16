
from influxdb import InfluxDBClient
from constantes.config import INFLUXDB_HOST, INFLUXDB_PORT, INFLUXDB_DATABASE

client = InfluxDBClient(
    host=INFLUXDB_HOST,
    port=INFLUXDB_PORT,
    database=INFLUXDB_DATABASE
)

# Verificar si la base de datos existe y crearla si no es así
if INFLUXDB_DATABASE not in [db["name"] for db in client.get_list_database()]:
    client.create_database(INFLUXDB_DATABASE)

def check_connection():
    return client.ping()
