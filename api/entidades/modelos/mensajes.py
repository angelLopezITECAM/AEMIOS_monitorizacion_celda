'''Modelo de bbdd para mensajes'''
from sqlalchemy import Column, Integer
from bbdd.influxdb import Base

class Mensajes(Base):
    """
    Modelo de bbdd para mensajes
    """
    __tablename__ = 'mensajes'
    id = Column(Integer, primary_key = True, index = True)
