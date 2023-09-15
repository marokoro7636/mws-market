from pydantic import BaseModel
from typing import Optional

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
    description: Optional[str]
    youtube: Optional[str]
    details: Optional[ProjectDetails]
    demo: Optional[None]
    review: Optional[dict[str, str]]
    isIndex: Optional[bool]

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

class Log(BaseModel):
    text: Optional[str]