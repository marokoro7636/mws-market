from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime
from fastapi import FastAPI, File, UploadFile

from helper.response import API_OK

router = APIRouter()

class RequiredSpec(BaseModel):
    item: str
    required: str

class Install(BaseModel):
    method: str
    info: str
    additional: Optional[str]

class ProjectDetails(BaseModel):
    img_screenshot: Optional[list[str]]
    required_spec: Optional[list[RequiredSpec]]
    install: Optional[list[Install]]
    forjob: Optional[str]

class SimpleSpecResponse(BaseModel):
    spec_id: str
    data: Optional[RequiredSpec]

@router.post("/{project_id}/details/imgs/{img_id}", response_model=API_OK)
def post_project_name(project_id: str, img_id:int, img: UploadFile):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # if check_img(img) is False:
    #     raise StarletteHTTPException(status_code=400, detail="Invalid image")
    # try:
    #     db.add_project_img(project_id, img_id, img)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project name")
    return API_OK()

@router.delete("/{project_id}/details/imgs/{img_id}", response_model=API_OK)
def delete_project_name(project_id: str, img_id:int):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.delete_project_img(project_id, img_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project name")
    return API_OK()

@router.post("/{project_id}/details/required_spec", response_model=SimpleSpecResponse)
def post_project_required_spec(project_id: str, required_spec: RequiredSpec):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     spec_id = db.add_project_required_spec(project_id, required_spec)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project required spec")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    project_hash_seed = f"{project_id}{required_spec}{timestamp}"
    spec_id = sha1_hash(project_hash_seed)
    return SimpleSpecResponse(spec_id=spec_id)

@router.get("/{project_id}/details/required_spec", response_model=list[SimpleSpecResponse])
def get_project_required_spec(project_id: str):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     data = db.get_project_required_specs(project_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to get project required spec")
    data = [
        SimpleSpecResponse(
            spec_id="spec_id",
            data=RequiredSpec(
                item="item",
                required="required",
            ),
        ),
    ]
    return data

@router.delete("/{project_id}/details/required_spec/{required_spec_id}", response_model=SimpleSpecResponse)
def delete_project_required_spec(project_id: str, required_spec_id: str):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.delete_project_required_spec(project_id, required_spec_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to delete project required spec")
    return SimpleSpecResponse(spec_id=required_spec_id)