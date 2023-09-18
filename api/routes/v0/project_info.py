from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

from helper.response import API_OK
from models.projects import Project

router = APIRouter()

@router.post("/{project_id}/name", response_model=API_OK)
def post_project_name(project_id: str, name: str):
    if Project.get_by_id(project_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.update_project_name(project_id, name)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project name"
        )
    return API_OK()

@router.post("/{project_id}/description", response_model=API_OK)
def post_project_description(project_id: str, description: str):
    if Project.get_by_id(project_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.update_project_description(project_id, description)
    except:
        raise StarletteHTTPException(
            status_code=500, detail="Failed to post project description"
        )
    return API_OK()

@router.post("/{project_id}/youtube", response_model=API_OK)
def post_project_youtube(project_id: str, youtube: str):
    if Project.get_by_id(project_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.update_project_youtube(project_id, youtube)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project youtube")
    return API_OK()

@router.delete("/{project_id}/youtube", response_model=API_OK)
def delete_project_youtube(project_id: str):
    if Project.get_by_id(project_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.delete_project_youtube(project_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project youtube")
    return API_OK()

@router.post("/{project_id}/hidden", response_model=API_OK)
def post_project_index(project_id: str, is_hidden: bool):
    if Project.get_by_id(project_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.update_project_index(project_id, is_hidden)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project index")
    return API_OK()
