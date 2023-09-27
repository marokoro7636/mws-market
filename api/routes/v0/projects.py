from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
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

from models.projects import Project

router = APIRouter()

@router.get("/", response_model=list[ProjectSummary])
def get_projects():
    try:
        data = Project.get_projects()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get projects")
    data = [
        ProjectSummary(
            name="Project1",
            description="Project1 description",
            # details={
            #     "img_screenshot": "https://demo.sirv.com/chair.jpg",
            #     "required": "detail2",
            # },
            # install={
            #     "install1": "install1",
            #     "install2": "install2",
            # },
            # forjob={
            #     "forjob1": "forjob1",
            #     "forjob2": "forjob2",
            # },
            # demo={
            #     "demo1": "demo1",
            #     "demo2": "demo2",
            # },
            # review={
            #     "review1": "review1",
            #     "review2": "review2",
            # },
            # isIndex=True,
            # members=["member1", "member2"],
        ),
    ]
    return data

@router.get("/{project_id}", response_model=ProjectInfo)
def get_project(project_id: str):
    if Project.is_exist(project_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        data = Project.get_project_by_id(project_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get projects")
    data = ProjectInfo()
    return data

@router.post("/", response_model=ProjectSimpleResponse)
def post_project(req: ProjectRequest):
    try:
        prj = Project.create(req.team, req.name)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post project")
    return ProjectSimpleResponse(project_id=prj.id)

@router.delete("/{project_id}", response_model=ProjectSimpleResponse)
def delete_project(project_id: str):
    if Project.is_exist(project_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Project not found")
    try:
        Project.delete_project(project_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete project")
    return ProjectSimpleResponse(project_id=project_id)

router.include_router(project_info.router, prefix="", tags=["project_info"])
router.include_router(project_details.router, prefix="", tags=["project_details"])