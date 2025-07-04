from bbdd.influxdb import client
import pytz
from datetime import datetime

def get_measurement(measurement, start=None, end=None, group_interval='1h'):
    """
    Obtiene los puntos de un measurement, agrupándolos en intervalos de tiempo
    para mejorar el rendimiento.
    """
    if not start or not end:
        raise ValueError("Los parámetros 'start' y 'end' son obligatorios.")

    # El manejo de zonas horarias es correcto, lo mantenemos.
    local_tz = pytz.timezone('Europe/Madrid')
    try:
        start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
        start_local = start_dt.astimezone(local_tz).isoformat()
        end_local = end_dt.astimezone(local_tz).isoformat()
    except ValueError as e:
        raise ValueError(f"Error al parsear fechas: {e}")

    # ---- QUERY OPTIMIZADA ----
    # Agrupamos por el intervalo de tiempo (ej. '1m') y seleccionamos el primer valor de cada grupo.
    # Usamos 'fill(none)' para no tener puntos nulos donde no hay datos.
    query = f'''
        SELECT FIRST(*) FROM "{measurement}" 
        WHERE time >= \'{start_local}\' AND time <= \'{end_local}\' 
        GROUP BY time({group_interval}) fill(none)
        ORDER BY time ASC
    '''

    try:
        result = client.query(query)
        points = list(result.get_points())
        return points
    except Exception as e:
        raise Exception(f"Error al consultar InfluxDB: {e}")

def get_alarms(start=None, end=None, group_interval='1h'):
    """
    Obtiene las alarmas de varios measurements, agrupando los resultados para
    evitar la sobrecarga de datos.
    """
    if not start or not end:
        raise ValueError("Los parámetros 'start' y 'end' son obligatorios.")
    
    # El manejo de zonas horarias es correcto.
    local_tz = pytz.timezone('Europe/Madrid')
    try:
        start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
        start_local = start_dt.astimezone(local_tz).isoformat()
        end_local = end_dt.astimezone(local_tz).isoformat()
    except ValueError as e:
        raise ValueError(f"Error al parsear fechas: {e}")

    # Measurements que contienen las alarmas
    measurements = ["alarm_flow_cathode", "alarm_flow_anode", "alarm_temperature_tc"]
    all_points = []

    for measurement in measurements:
        # ---- QUERY OPTIMIZADA ----
        # Usamos FIRST(value) para obtener el primer valor en cada ventana de tiempo.
        # También seleccionamos los campos necesarios y los agrupamos por todos ellos.
        query = f'''
            SELECT 
                FIRST("value") AS "value", 
                FIRST("message") AS "message", 
                FIRST("ud") AS "ud"
            FROM "{measurement}"
            WHERE time >= \'{start_local}\' AND time <= \'{end_local}\'
            GROUP BY time({group_interval}), * fill(none)
        '''
        
        try:
            result = client.query(query)
            points = list(result.get_points())
            
            for point in points:
                point["measurement"] = measurement
                all_points.extend([point]) # Usamos extend para añadir el punto
        except Exception as e:
            print(f"Error consultando {measurement}: {e}")
    
    # Ordenamos todas las alertas combinadas por tiempo
    all_points.sort(key=lambda x: x["time"])
    
    return all_points

def insertar(influx_point):
    """
    Inserta un punto de datos en InfluxDB.
    """
    try:
        success = client.write_points([influx_point])
        if not success:
            print("Error al escribir el punto de datos en InfluxDB.")
    except Exception as e:
        print("Error al escribir en InfluxDB:", e)