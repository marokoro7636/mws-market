from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Optional
from fastapi import Header
from helper.util import sha1_hash
from fastapi import UploadFile
import datetime
from helper.auth import isAuthed
from helper.check import check_img
from helper.response import API_OK
from models.projects import Project

router = APIRouter()

@router.post("/{project_id}/name", response_model=API_OK)
def post_project_name(project_id: str, name: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).set_name(name)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project name"
        )
    return API_OK()

@router.post("/{project_id}/short_description", response_model=API_OK)
def post_project_short_description(project_id: str, short_description: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).set_short_description(short_description)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project short description"
        )
    return API_OK()

@router.post("/{project_id}/description", response_model=API_OK)
def post_project_description(project_id: str, description: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).set_description(description)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project description"
        )
    return API_OK()

@router.post("/{project_id}/youtube", response_model=API_OK)
def post_project_youtube(project_id: str, youtube: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).set_youtube(youtube)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project youtube")
    return API_OK()

@router.delete("/{project_id}/youtube", response_model=API_OK)
def delete_project_youtube(project_id: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).delete_youtube()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project youtube")
    return API_OK()

@router.post("/{project_id}/hidden", response_model=API_OK)
def post_project_hidden(project_id: str, hidden: bool, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).set_hidden(hidden)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project hidden")
    return API_OK()

@router.post("/{project_id}/icon", response_model=API_OK)
def post_project_icon(project_id: str, icon: UploadFile, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if check_img(icon.file) is False:
        raise StarletteHTTPException(status_code=400, detail="Invalid image")
    try:
        Project(project_id).set_icon(icon.file)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project icon")
    return API_OK()

@router.delete("/{project_id}/icon", response_model=API_OK)
def delete_project_icon(project_id: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).delete_icon()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project icon")
    return API_OK()

@router.post("/{project_id}/img", response_model=API_OK)
def post_project_img(project_id: str, img: UploadFile, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if check_img(img.file) is False:
        raise StarletteHTTPException(status_code=400, detail="Invalid image")
    try:
        Project(project_id).set_img(img.file)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project img")
    return API_OK()

@router.delete("/{project_id}/img", response_model=API_OK)
def delete_project_img(project_id: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).delete_img()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project img")
    return API_OK()