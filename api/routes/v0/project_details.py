from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
from helper.check import check_img
from helper.auth import isAuthed
import datetime
from fastapi import FastAPI, File, UploadFile
from typing import Optional
from fastapi import Header
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
        data = Project(project_id).get_details()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project details")
    return ProjectDetails(**data)

@router.post("/{project_id}/details/imgs", response_model=API_OK)
def post_project_img(project_id: str, img: UploadFile, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if check_img(img) is False:
        raise StarletteHTTPException(status_code=400, detail="Invalid image")
    try:
        Project(project_id).add_img_screenshot(img)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project image")
    return API_OK()

@router.delete("/{project_id}/details/imgs/{img_id}", response_model=API_OK)
def delete_project_img(project_id: str, img_id:str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).delete_img_screenshot(img_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project image")
    return API_OK()

@router.post("/{project_id}/details/required_spec", response_model=API_OK)
def post_project_required_spec(project_id: str, required_spec: RequiredSpec, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    #対象のproject_idのprojectがなければ404
    if not Project.is_exist(project_id):
         raise StarletteHTTPException(status_code=404, detail="Project not found")
    #DBへ格納
    try:
        Project(project_id).add_required_spec(required_spec)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project required spec")
    return API_OK()

@router.get("/{project_id}/details/required_spec", response_model=list[SimpleSpecResponse])
def get_project_required_spec(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        data = Project(project_id).get_required_spec()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get project required spec")
    return [SimpleSpecResponse(spec_id=key, data=value) for key, value in data.items()]

@router.delete("/{project_id}/details/required_spec/{required_spec_id}", response_model=API_OK)
def delete_project_required_spec(project_id: str, required_spec_id: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).delete_required_spec(required_spec_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project required spec")
    return API_OK()

@router.post("/{project_id}/details/install", response_model=API_OK)
def post_project_install(project_id: str, install: Install, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
         raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).add_install(install)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project install")
    return API_OK()

@router.delete("/{project_id}/details/install/{install_id}", response_model=API_OK)
def delete_project_install(project_id: str, install_id: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).delete_install(install_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project install")
    return API_OK()

@router.post("/{project_id}/details/forjob", response_model=API_OK)
def post_project_forjob(project_id: str, forjob: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
         raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).set_forjob(forjob)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project forjob")
    return API_OK()

@router.delete("/{project_id}/details/forjob", response_model=API_OK)
def delete_project_forjob(project_id: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project(project_id).delete_forjob()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project forjob")
    return API_OK()