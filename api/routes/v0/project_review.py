from fastapi import APIRouter
from typing import Optional
from fastapi import Header
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime
from helper.auth import isAuthed
from helper.response import API_OK
from models.requests import ProjectReview
from models.projects import Project

router = APIRouter()

@router.post("/{project_id}/review", response_model=API_OK)
def post_project_review(project_id: str, review: ProjectReview, x_auth_token: Optional[str] = Header(None)):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if not isAuthed(Project(project_id).get_team(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Project(project_id).add_review(review)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project review")
    return API_OK()

@router.delete("/{project_id}/review/{review_id}", response_model=API_OK)
def delete_project_review(project_id: str, review_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if not isAuthed(Project(project_id).get_team(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Project(project_id).delete_review(review_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project review")
    return API_OK()