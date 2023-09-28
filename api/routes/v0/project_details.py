from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
from helper.check import check_img
import datetime
from fastapi import FastAPI, File, UploadFile
from models.requests import (
    RequiredSpec,
    Install,
    ProjectDetails,
    SimpleSpecResponse
)
from helper.response import API_OK
from models.projects import Project

router = APIRouter()


@router.get("/{project_id}/details", response_model=ProjectDetails)
def get_project_details(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        data = Project.load_by_id(project_id).get_details()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project image")
    return ProjectDetails(**data)

@router.post("/{project_id}/details/imgs", response_model=API_OK)
def post_project_img(project_id: str, img: UploadFile):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if check_img(img) is False:
        raise StarletteHTTPException(status_code=400, detail="Invalid image")
    try:
        Project.load_by_id(project_id).add_img_screenshot(img)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project image")
    return API_OK()

@router.delete("/{project_id}/details/imgs/{img_id}", response_model=API_OK)
def delete_project_img(project_id: str, img_id:str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).delete_img_screenshot(img_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project image")
    return API_OK()

@router.post("/{project_id}/details/required_spec", response_model=API_OK)
def post_project_required_spec(project_id: str, required_spec: RequiredSpec):
    #対象のproject_idのprojectがなければ404
    if not Project.is_exist(project_id):
         raise StarletteHTTPException(status_code=404, detail="Project not found")
    #DBへ格納
    try:
        Project.load_by_id(project_id).add_required_spec(required_spec)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project required spec")
    return API_OK()

@router.get("/{project_id}/details/required_spec", response_model=list[SimpleSpecResponse])
def get_project_required_spec(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        data = Project.load_by_id(project_id).get_required_spec()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get project required spec")
    return [SimpleSpecResponse(spec_id=key, data=value) for key, value in data.items()]

@router.delete("/{project_id}/details/required_spec/{required_spec_id}", response_model=API_OK)
def delete_project_required_spec(project_id: str, required_spec_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).delete_required_spec(required_spec_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project required spec")
    return API_OK()

@router.get("/{project_id}/details/img_screenshot")
def get_project_img_screenshot(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        data = Project.load_by_id(project_id).get_img_screenshot()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get project required spec")
    return data