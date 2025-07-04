from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def add(app: FastAPI):
    """
    Función para habilitar cors
    """
    app.add_middleware(CORSMiddleware,
                       allow_origins=["http://localhost:3002", "http://192.168.15.38:3002", "http://192.168.15.109:3002", "http://192.168.15.151:3002", "http://92.113.26.225:3002"],
                       allow_credentials = True,
                       allow_methods = ["*"],
                       allow_headers = ["*"])

