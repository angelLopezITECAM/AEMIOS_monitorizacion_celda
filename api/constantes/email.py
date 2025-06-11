from os import getenv
import socket

from dotenv import load_dotenv

load_dotenv(".env")


SERVIDOR = "smtp.office365.com"
PUERTO_SMTP = 587
REMITENTE = "diseno@itecam.com"
PASSWORD = "It_Disen0"

""" SERVIDOR = "smtp-relay.gmail.com"
PUERTO_SMTP = 587
REMITENTE = "celdaemh2@gmail.com"
PASSWORD = "AEM_H2.2025"
 """