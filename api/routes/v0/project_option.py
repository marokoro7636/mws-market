from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Optional
from fastapi import Header
from helper.util import make_description
from fastapi import UploadFile
import datetime
from helper.auth import isAuthed
from helper.check import check_img
from helper.response import API_OK
from models.projects import Project
from models.teams import Teams

router = APIRouter()

@router.get("/make_description")
def get_description(youtube: Optional[str] = None, github: Optional[str] = None, description: Optional[str] = None):
    try:
        description, source = make_description(youtube, github, description)
    except Exception as e:
        print(e)
        raise StarletteHTTPException(status_code=500, detail="Failed to get project description")
    return {"description": description, "src": source}
