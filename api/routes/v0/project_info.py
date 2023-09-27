from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
from fastapi import UploadFile
import datetime

from helper.check import check_img
from helper.response import API_OK
from models.projects import Project

router = APIRouter()

@router.post("/{project_id}/name", response_model=API_OK)
def post_project_name(project_id: str, name: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).set_name(name)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project name"
        )
    return API_OK()

@router.post("/{project_id}/short_description", response_model=API_OK)
def post_project_short_description(project_id: str, short_description: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).set_short_description(short_description)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project short description"
        )
    return API_OK()

@router.post("/{project_id}/description", response_model=API_OK)
def post_project_description(project_id: str, description: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).set_description(description)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project description"
        )
    return API_OK()

@router.post("/{project_id}/youtube", response_model=API_OK)
def post_project_youtube(project_id: str, youtube: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).set_youtube(youtube)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project youtube")
    return API_OK()

@router.delete("/{project_id}/youtube", response_model=API_OK)
def delete_project_youtube(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).delete_youtube()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project youtube")
    return API_OK()

@router.post("/{project_id}/hidden", response_model=API_OK)
def post_project_index(project_id: str, is_hidden: bool):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).set_index(is_hidden)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project index")
    return API_OK()

@router.post("/{project_id}/icon", response_model=API_OK)
def post_project_icon(project_id: str, icon: UploadFile):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if check_img(icon) is False:
        raise StarletteHTTPException(status_code=400, detail="Invalid image")
    try:
        Project.load_by_id(project_id).set_icon(icon)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project icon")
    return API_OK()

@router.delete("/{project_id}/icon", response_model=API_OK)
def delete_project_icon(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).delete_icon()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project icon")
    return API_OK()

@router.post("/{project_id}/img", response_model=API_OK)
def post_project_img(project_id: str, img: UploadFile):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if check_img(img) is False:
        raise StarletteHTTPException(status_code=400, detail="Invalid image")
    try:
        Project.load_by_id(project_id).set_img(img)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project img")
    return API_OK()

@router.delete("/{project_id}/img", response_model=API_OK)
def delete_project_img(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).delete_img()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project img")
    return API_OK()