# app/models/command.py

from pydantic import BaseModel
from typing import Dict

class Command(BaseModel):
    device_id: str
    action: str
    params: Dict = {}
