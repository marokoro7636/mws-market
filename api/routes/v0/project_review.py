from fastapi import APIRouter
from typing import Optional
from fastapi import Header
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime
from helper.auth import isAuthed
from helper.response import API_OK
from models.requests import ProjectReviewRequest
from models.projects import Project
from models.teams import Teams

router = APIRouter()

@router.post("/{project_id}/review", response_model=API_OK)
def post_project_review(project_id: str, review: ProjectReviewRequest, x_auth_token: Optional[str] = Header(None)):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if not isAuthed([review.user], x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Project(project_id).add_review(review)
    except Exception as e:
        print(e)
        raise StarletteHTTPException(status_code=500, detail="Failed to post project review")
    return API_OK()

@router.delete("/{project_id}/review/{review_id}", response_model=API_OK)
def delete_project_review(project_id: str, review_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    review = Project(project_id).get_review().get(review_id)
    if review is None:
        raise StarletteHTTPException(status_code=404, detail="Review not found")
    if not isAuthed([review.user], x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Project(project_id).delete_review(review_id)
    except Exception as e:
        print(e)
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project review")
    return API_OK()