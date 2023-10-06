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
    img_screenshot: Optional[dict[str, str]] = dict()
    required_spec: Optional[dict[str, RequiredSpec]] = dict()
    install: Optional[dict[str, Install]] = dict()
    forjob: Optional[str] = None

class SimpleSpecResponse(BaseModel):
    spec_id: str
    data: Optional[RequiredSpec] = None

class ProjectReview(BaseModel):
    user: str
    title: str
    content: str
    rating: int

class ProjectSimpleResponse(BaseModel):
    id: str

class ProjectRequest(BaseModel):
    team: str
    name: str

class Rating(BaseModel):
    total: int
    count: int

class ProjectInfo(BaseModel):
    id: str
    name: str
    team: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    youtube: Optional[str] = None
    details: Optional[ProjectDetails] = dict()
    review: Optional[dict[str, ProjectReview]] = dict()
    rating: Rating
    hidden: Optional[bool] = None
    icon: Optional[str] = None
    img: Optional[str] = None

class ProjectSummary(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    rating: Rating
    youtube: Optional[str] = None
    team: Optional[str] = None

class Team(BaseModel):
    name: str
    year: int
    description: Optional[str] = None
    members: list[str]
    secret: Optional[str] = None
    relations: list[str]

class TeamRequest(BaseModel):
    name: str
    year: int
    description: Optional[str] = None
    members: list[str]

class TeamResponse(BaseModel):
    id: str
    name: str
    year: int
    description: str
    members: list[str]
    relations: list[str]


class TeamSimpleResponse(BaseModel):
    id: str

class Log(BaseModel):
    text: Optional[str] = None

class User(BaseModel):
    name: str
    team: Optional[list[str]] = list()

class UserRequest(BaseModel):
    id: str
    name: str
