'''servicios para mensajes'''
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from fastapi import Depends, status
from bbdd.influxdb import get_db
from entidades.modelos.mensajes import Mensajes

"""
Aqui van las dependencias con otras tablas
"""
dependencias = []

async def get_all(db : AsyncSession = Depends(get_db)):
    mensajess = await db.execute(select(Mensajes).options(*dependencias))
    return mensajess.scalars()

