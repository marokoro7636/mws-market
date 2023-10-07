from pydantic import BaseModel, field_validator
from typing import Optional

class RequiredSpec(BaseModel):
    id: str
    item: str
    required: str

class RequiredSpecRequest(BaseModel):
    item: str
    required: str

class Install(BaseModel):
    id: str
    method: str
    info: str
    additional: Optional[str] = None

class InstallRequest(BaseModel):
    method: str
    info: str
    additional: Optional[str] = None

class ImgScreenshot(BaseModel):
    id: str
    path: str

class ProjectDetails(BaseModel):
    img_screenshot: Optional[list[ImgScreenshot]] = list()
    required_spec: Optional[list[RequiredSpec]] = list()
    install: Optional[list[Install]] = list()
    forjob: Optional[str] = None

    @field_validator("required_spec", mode="before")
    def convert_required_spec(cls, d):
        if isinstance(d, dict):
            return [RequiredSpec(id=key, **value) for key, value in d.items()]
        else:
            return []

    @field_validator("img_screenshot", mode="before")
    def convert_img_screenshot(cls, d):
        if isinstance(d, dict):
            return [ImgScreenshot(id=key, path=value) for key, value in d.items()]
        else:
            return []

    @field_validator("install", mode="before")
    def convert_install(cls, d):
        if isinstance(d, dict):
            return [Install(id=key, **value) for key, value in d.items()]
        else:
            return []

class SimpleSpecResponse(BaseModel):
    spec_id: str
    data: Optional[RequiredSpec] = None

class ProjectReview(BaseModel):
    id: str
    user: str
    title: str
    content: str
    rating: int

class ProjectReviewRequest(BaseModel):
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

class ProjectSummary(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    rating: Rating
    youtube: Optional[str] = None
    team: Optional[str] = None
    icon: Optional[str] = None
    img: Optional[str] = None

class ProjectInfo(BaseModel):
    id: str
    name: str
    team: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    youtube: Optional[str] = None
    details: Optional[ProjectDetails] = ProjectDetails()
    review: Optional[list[ProjectReview]] = list()
    rating: Rating
    hidden: Optional[bool] = None
    icon: Optional[str] = None
    img: Optional[str] = None
    own: bool = False
    previous: Optional[list[ProjectSummary]] = list()

    @field_validator("review", mode="before")
    def convert(cls, d):
        if isinstance(d, dict):
            return [ProjectReview(id=key, **value) for key, value in d.items()]
        else:
            return []


class TeamMember(BaseModel):
    id: str
    name: str
    image: str

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
    members: list[TeamMember]
    relations: list[str]
    project: Optional[str] = None

class Team(BaseModel):
    id:str
    name: str
    year: int
    description: Optional[str] = None
    members: list[TeamMember]
    secret: Optional[str] = None
    relations: list[TeamResponse]
    project: Optional[str] = None

class TeamSimpleResponse(BaseModel):
    id: str

class Log(BaseModel):
    text: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    team: Optional[list[str]] = list()

class UserRequest(BaseModel):
    id: str
    name: str
