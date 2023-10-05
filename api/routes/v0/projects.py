from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional
from fastapi import Header
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
from helper.auth import isAuthed
import datetime

from models.requests import (
    ProjectDetails,
    ProjectSimpleResponse,
    ProjectRequest,
    ProjectInfo,
    ProjectSummary,
)
import routes.v0.project_info as project_info
import routes.v0.project_details as project_details
import routes.v0.project_review as project_review
import routes.v0.project_option as project_option

from models.projects import Project
from models.teams import Teams

router = APIRouter()

@router.get("/", response_model=list[ProjectSummary])
def get_projects(limit: int = 10, page: int = 1, order: Optional[str] = None):
    if limit < 1 and limit > 100:
        raise StarletteHTTPException(status_code=400, detail="Incorrect limit")
    if page < 1:
        raise StarletteHTTPException(status_code=400, detail="Incorrect page")
    if not Project.allow_order(order):
        raise StarletteHTTPException(status_code=400, detail="Incorrect order")
    try:
        summary = Project.get_project(limit, page, order)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get projects")
    return [ProjectSummary(id = key, **value) for key, value in summary.items()]

@router.get("/{project_id}", response_model=ProjectInfo)
def get_project(project_id: str):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        info = Project(project_id).get_info()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get projects")
    return info

@router.post("/", response_model=ProjectSimpleResponse)
def post_project(req: ProjectRequest, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(req.team):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(req.team).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        prj = Project.create(req)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project")
    return ProjectSimpleResponse(id=prj.id)

@router.delete("/{project_id}", response_model=ProjectSimpleResponse)
def delete_project(project_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Project.is_exist(project_id):
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    if not isAuthed(Teams(Project(project_id).get_team()).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Project(project_id).delete()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project")
    return ProjectSimpleResponse(id=project_id)

router.include_router(project_info.router, prefix="", tags=["project_info"])
router.include_router(project_details.router, prefix="", tags=["project_details"])
router.include_router(project_review.router, prefix="", tags=["project_review"])
router.include_router(project_option.router, prefix="", tags=["project_option"])