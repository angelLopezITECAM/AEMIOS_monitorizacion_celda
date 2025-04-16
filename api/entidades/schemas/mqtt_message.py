# app/models/point.py

from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime
from typing import Any

class MqttMessage(BaseModel):
    message: Any
