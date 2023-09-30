from pydantic import BaseModel
from typing import Optional

class RequiredSpec(BaseModel):
    item: str
    required: str

class Install(BaseModel):
    method: str
    info: str
    additional: Optional[str] = None

class ProjectDetails(BaseModel):
    img_screenshot: Optional[dict[str, str]] = None
    required_spec: Optional[dict[str, RequiredSpec]] = None
    install: Optional[dict[str, Install]] = None
    forjob: Optional[str] = None

class SimpleSpecResponse(BaseModel):
    spec_id: str
    data: Optional[RequiredSpec] = None

class ProjectReview(BaseModel):
    title: str
    content: str
    rating: int

class ProjectSimpleResponse(BaseModel):
    project_id: str

class ProjectRequest(BaseModel):
    team: str
    name: str

class ProjectInfo(BaseModel):
    id: str
    name: str
    team: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    youtube: Optional[str] = None
    details: Optional[ProjectDetails] = None
    demo: Optional[None] = None
    review: Optional[dict[str, ProjectReview]] = None
    isIndex: Optional[bool] = None
    icon: Optional[str] = None
    img: Optional[str] = None

class ProjectSummary(BaseModel):
    id: str
    name: str
    description: str
    youtube: str
    team: str

class Team(BaseModel):
    name: str
    year: int
    description: str
    members: list[str]
    secret: str

class Log(BaseModel):
    text: Optional[str] = None