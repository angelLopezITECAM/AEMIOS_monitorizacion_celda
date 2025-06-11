# Utilizar una imagen base de Python
FROM python:3.9-slim

#RUN apt-get update && apt-get install -y cron
# # Establecer el directorio de trabajo dentro del contenedor
RUN pip install uv
WORKDIR /api
# Copiar los archivos del proyecto al contenedor
COPY . /api

# Instalar las dependencias del proyecto
RUN uv sync 
# Exponer el puerto 8002 para FastAPI
EXPOSE 8002
# Comando para ejecutar la aplicacion FastAPI usando Uvicorn
#CMD ["cron", "-f"]
#CMD ["sh", "-c", "cd ..; uv run uvicorn api.main:app --host 0.0.0.0 --port 8002"]
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"]
