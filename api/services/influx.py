from bbdd.influxdb import client
import pytz
from datetime import datetime

def get_measurement(measurement, start=None, end=None):
    
    """
    Obtiene los puntos de un measurement específico en InfluxDB.
    """

    if start and end:
        # Definir la zona horaria local (España)
        local_tz = pytz.timezone('Europe/Madrid')
        
        # Convertir los strings ISO a objetos datetime con pytz
        try:
            # Asegurar que las fechas tienen información de zona horaria
            if '+' not in start and 'Z' in start:
                # Si es UTC (termina en Z), convertir a objeto datetime en UTC
                start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
            else:
                # Ya tiene información de zona horaria o no tiene Z
                start_dt = datetime.fromisoformat(start)
                
            if '+' not in end and 'Z' in end:
                end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
            else:
                end_dt = datetime.fromisoformat(end)
                
            # Convertir a la zona horaria local
            start_local = start_dt.astimezone(local_tz)
            end_local = end_dt.astimezone(local_tz)
            
            # Formatear para InfluxDB (requiere formato ISO)
            start = start_local.isoformat()
            end = end_local.isoformat()
            
            print(f"Fechas convertidas: {start} a {end}")
        except ValueError as e:
            print(f"Error al parsear fechas: {e}")
            # Continuar con las fechas originales si hay error
    
    query = f'SELECT * FROM "{measurement}" WHERE time >= \'{start}\' AND time <= \'{end}\' ORDER BY time ASC'

    try:
        result = client.query(query)
        points = list(result.get_points())
        return points
    except Exception as e:
        raise Exception(f"Error al consultar InfluxDB: {e}")
    

def get_alarms(start=None, end=None):
    
    """
    Obtiene los puntos de un measurement específico en InfluxDB.
    """

    if start and end:
        # Definir la zona horaria local (España)
        local_tz = pytz.timezone('Europe/Madrid')
        
        # Convertir los strings ISO a objetos datetime con pytz
        try:
            # Asegurar que las fechas tienen información de zona horaria
            if '+' not in start and 'Z' in start:
                # Si es UTC (termina en Z), convertir a objeto datetime en UTC
                start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
            else:
                # Ya tiene información de zona horaria o no tiene Z
                start_dt = datetime.fromisoformat(start)
                
            if '+' not in end and 'Z' in end:
                end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
            else:
                end_dt = datetime.fromisoformat(end)
                
            # Convertir a la zona horaria local
            start_local = start_dt.astimezone(local_tz)
            end_local = end_dt.astimezone(local_tz)
            
            # Formatear para InfluxDB (requiere formato ISO)
            start = start_local.isoformat()
            end = end_local.isoformat()
            
            print(f"Fechas convertidas: {start} a {end}")
        except ValueError as e:
            print(f"Error al parsear fechas: {e}")
            # Continuar con las fechas originales si hay error
    
        measurements = ["alarm_flow_cathode", "alarm_flow_anode"]
    all_points = []
    
    for measurement in measurements:
        query = f'SELECT * FROM "{measurement}" WHERE time >= \'{start}\' AND time <= \'{end}\' ORDER BY time ASC'
        
        try:
            result = client.query(query)
            points = list(result.get_points())
            
            # Añadir el nombre del measurement a cada punto
            for point in points:
                point["measurement"] = measurement
                
            all_points.extend(points)
        except Exception as e:
            print(f"Error consultando {measurement}: {e}")
    
    # Ordenar todos los puntos por tiempo
    all_points.sort(key=lambda x: x["time"])
    
    return all_points

    
def insertar(influx_point):

    try:
        # write_points espera una lista de puntos
        success = client.write_points([influx_point])
        if not success:
            print("Error al escribir el punto de datos en InfluxDB.")
    except Exception as e:
        print("Error al escribir en InfluxDB:", e)
