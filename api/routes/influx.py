# app/api/endpoints/commands.py

from fastapi import APIRouter, HTTPException
from bbdd.influxdb import check_connection
from entidades.schemas.point import DataPoint
from services.influx import insertar, get_measurement, get_alarms

ALLOWED_MEASUREMENTS = {"temperature_tc", "amperage_tc", "amperage_pumps", "flow_anode", "flow_cathode", "relay", "anodo_pump", "cathodo_pump", "speed_an_pump", "speed_cat_pump", "status_relay", "status_anode_pump", "status_cathode_pump", "status_speed_an_pump", "status_speed_cat_pump", "state"}


router = APIRouter()

@router.get("/ping", tags=["Comandos"])
async def check():
    """
    Verifica la conexión a InfluxDB.
    """
    try:
        connection_status = check_connection()
        if connection_status:
            return {"status": "Conectado a InfluxDB"}
        else:
            raise HTTPException(status_code=500, detail="No se puede conectar a InfluxDB")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/post")
async def post_data(point: DataPoint):

    if point.magnitude not in ALLOWED_MEASUREMENTS:
        raise HTTPException(
            status_code=400, 
            detail=f"Magnitud '{point.magnitude}' no permitida"
        )

    try:
        insertar(point)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"status": "Point inserted successfully"}

@router.get("/data/{measurement}")
async def get_data(measurement: str, start: str = None, end: str = None):
        
    if measurement not in ALLOWED_MEASUREMENTS:
        raise HTTPException(
            status_code=400, 
            detail=f"Magnitud '{measurement}' no permitida"
        )

    if start is None or end is None:
        raise HTTPException(
            status_code=400, 
            detail="Se requieren parámetros 'start' y 'end'"
        )
    
    try:
        points = get_measurement(measurement, start, end)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "count": len(points),
        "results": points
    }

@router.get("/alarms")
async def get_alarms_route( start: str = None, end: str = None):
        

    if start is None or end is None:
        raise HTTPException(
            status_code=400, 
            detail="Se requieren parámetros 'start' y 'end'"
        )
    
    try:
        points = get_alarms(start, end)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "count": len(points),
        "results": points
    }
    