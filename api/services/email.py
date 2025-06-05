from smtplib import SMTP
from constantes.email import PASSWORD, PUERTO_SMTP, REMITENTE, SERVIDOR
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def crear_mensaje(msg: str):
    return f"""
    <html>
        <body>
            <p>{msg}</p>
        </body>

    </html>
    """


def enviar(destino: str, mensaje):
    servidor = SMTP(SERVIDOR, PUERTO_SMTP)
    servidor.starttls()
    servidor.login(REMITENTE, PASSWORD)
    correo = MIMEMultipart()
    correo["From"] = REMITENTE
    correo["To"] = destino
    correo["Subject"] = "AEMIOS - Nueva alerta registrada"
    correo.attach(MIMEText(mensaje, "html"))
    servidor.send_message(correo)
    servidor.quit()
