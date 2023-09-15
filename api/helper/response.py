import typing
from pydantic import BaseModel

class API_OK(BaseModel):
    status: str = "ok"