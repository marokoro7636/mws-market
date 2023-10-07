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

@router.get("/{project_id}/make_description")
def get_project_description(project_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if not isAuthed(Teams(Project(project_id).get_team()).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")

    youtube = Project(project_id).get_youtube()
    if youtube is None:
        raise StarletteHTTPException(status_code=404, detail="Youtube not found")
    try:
        description = make_description(youtube, 400)
    except Exception as e:
        print(e)
        raise StarletteHTTPException(status_code=500, detail="Failed to get project description")
    return {"description": description}

@router.get("/{project_id}/make_short_description")
def get_project_short_description(project_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if not isAuthed(Teams(Project(project_id).get_team()).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")

    youtube = Project(project_id).get_youtube()
    if youtube is None:
        raise StarletteHTTPException(status_code=404, detail="Youtube not found")
    try:
        short_description = make_description(youtube, 100)
    except Exception as e:
        print(e)
        raise StarletteHTTPException(status_code=500, detail="Failed to get project short description")
    return {"short_description": short_description}