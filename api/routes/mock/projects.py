from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

import routes.mock.project_info as project_info
import routes.mock.project_details as project_details

import routes.mock.project_details as project_details

router = APIRouter()

class ProjectSimpleResponse(BaseModel):
    project_id: str

class ProjectRequest(BaseModel):
    team: str
    name: str

# TODO: members to team
class ProjectInfo(BaseModel):
    name: str
    description: str
    details: Optional[project_details.ProjectDetails]
    demo: Optional[None]
    review: Optional[dict[str, str]]
    isIndex: Optional[bool]
    team: str

class ProjectSummary(BaseModel):
    id: str
    name: str
    description: str
    team: str

@router.get("/", response_model=list[ProjectSummary])
def get_projects():
    # try:
    #     data = db.get_projects()
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to get projects")
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
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     data = db.get_project_by_id(project_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to get projects")
    data = ProjectInfo()
    return data

@router.post("/", response_model=ProjectSimpleResponse)
def post_project(req: ProjectRequest):
    # try:
    #     project_id = db.create_project(req.owner, req.name)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post project")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    project_hash_seed = f"{req.owner}{req.name}{timestamp}"
    project_id = sha1_hash(project_hash_seed)
    return ProjectSimpleResponse(project_id=project_id)

@router.delete("/{project_id}", response_model=ProjectSimpleResponse)
def delete_project(project_id: str):
    # if db.get_project_by_id(project_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Project not found")
    # try:
    #     db.delete_project(project_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to delete project")
    return ProjectSimpleResponse(project_id=project_id)

router.include_router(project_info.router, prefix="", tags=["mock_project_info"])
router.include_router(project_details.router, prefix="", tags=["mock_project_details"])