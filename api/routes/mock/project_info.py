from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

from helper.response import API_OK

router = APIRouter()

@router.post("/{project_id}/name", response_model=API_OK)
def post_project_name(project_id: str, name: str):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.update_project_name(project_id, name)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project name")
    return API_OK()

@router.post("/{project_id}/description", response_model=API_OK)
def post_project_description(project_id: str, description: str):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.update_project_description(project_id, description)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project description")
    return API_OK()

@router.post("/{project_id}/hidden", response_model=API_OK)
def post_project_index(project_id: str, is_hidden: bool):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.update_project_index(project_id, is_hidden)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project index")
    return API_OK()

