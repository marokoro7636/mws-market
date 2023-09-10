# TODO:delete

from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional

router = APIRouter()


class Log(BaseModel):
    text: Optional[str]


@router.post("/test")
def post_text(text: Log):
    # safe_text = sanitize(text)
    # try:
    #      db_store(safe_text)
    # except:
    #      return {"error":"failed to write"}
    # return {"text":safe_text}
    return {"text": text}
