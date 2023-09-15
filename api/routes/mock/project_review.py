from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

from helper.response import API_OK
from models.requests import ProjectReview
router = APIRouter()

@router.post("/{project_id}/review", response_model=API_OK)
def post_project_review(project_id: str, review: ProjectReview):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.add_project_review(project_id, review.title, review.content, review.rating)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project review")
    return API_OK()

@router.delete("/{project_id}/review/{review_id}", response_model=API_OK)
def delete_project_review(project_id: str, review_id: str):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.delete_project_review(project_id, review_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to delete project review")
    return API_OK()

@router.create("/{project_id}/review/{review_id}", response_model=API_OK)
def update_project_review(project_id: str, review_id: str, review: ProjectReview):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.update_project_review(project_id, review_id, review.title, review.content, review.rating)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to create project review")
    return API_OK()