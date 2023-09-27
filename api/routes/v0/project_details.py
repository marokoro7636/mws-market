from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime
from fastapi import FastAPI, File, UploadFile
from models.requests import RequiredSpec, Install, ProjectDetails, SimpleSpecResponse
from helper.response import API_OK
from models.projects import Project

router = APIRouter()

from models.projects import Project as db

@router.post("/{project_id}/details/imgs/{img_id}", response_model=API_OK)
def post_project_name(project_id: str, img_id:str, img: UploadFile):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if Project.check_img(img) is False:
        raise StarletteHTTPException(status_code=400, detail="Invalid image")
    try:
        Project.load_by_id(project_id).add_img(img_id, img)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project image")
    return API_OK()

@router.delete("/{project_id}/details/imgs/{img_id}", response_model=API_OK)
def delete_project_name(project_id: str, img_id:str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).delete_img(img_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project image")
    return API_OK()

@router.post("/{project_id}/details/required_spec", response_model=SimpleSpecResponse)
def post_project_required_spec(project_id: str, required_spec: RequiredSpec):
    #対象のproject_idのprojectがなければ404
    if not Project.is_exist(project_id):
         raise StarletteHTTPException(status_code=404, detail="Project not found")
    #時間情報からspec_idを作成
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    project_hash_seed = f"{project_id}{required_spec}{timestamp}"
    spec_id = sha1_hash(project_hash_seed)
    #DBへ格納
    try:
        Project.load_by_id(project_id).add_required_spec(spec_id, required_spec)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project required spec")
    #Spec_idを返す
    return SimpleSpecResponse(spec_id=spec_id, data=required_spec)

@router.get("/{project_id}/details/required_spec", response_model=list[SimpleSpecResponse])
def get_project_required_spec(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        data = Project.load_by_id(project_id).get_required_specs()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get project required spec")
    return data

@router.delete("/{project_id}/details/required_spec/{required_spec_id}", response_model=SimpleSpecResponse)
def delete_project_required_spec(project_id: str, required_spec_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.load_by_id(project_id).delete_required_spec(required_spec_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project required spec")
    return SimpleSpecResponse(spec_id=required_spec_id)