from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

from helper.response import API_OK

from models.requests import Team, TeamSimpleResponse

from models.projects import Project


router = APIRouter()

@router.get("/", response_model=list[Team])
def get_teams():
    try:
        data = Project.get_teams()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    return data

@router.post("/", response_model=TeamSimpleResponse)
def post_team(team: Team):
    print("team")
    try:
        res = Project.add_team(team)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team")
    print(res)
    return TeamSimpleResponse(team_id = res.team_id)

@router.post("/{team_id}/name", response_model=API_OK)
def post_team_name(team_id: str, name: str):
    if Project.get_team_by_id(team_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Project.update_team_name(team_id, name)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team name")
    return API_OK()

@router.post("/{team_id}/year", response_model=API_OK)
def post_team_year(team_id: str, year: int):
    if Project.get_team_by_id(team_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Project.update_team_year(team_id, year)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team year")
    return API_OK()

@router.post("/{team_id}/description", response_model=API_OK)
def post_team_description(team_id: str, description: str):
    if Project.get_team_by_id(team_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Project.update_team_description(team_id, description)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team description")
    return API_OK()

@router.post("/{team_id}/members", response_model=API_OK)
def post_team_members(team_id: str, new_members: list[str]):
    if Project.get_team_by_id(team_id) is None:
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Project.add_team_members(team_id, new_members)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team members")
    return API_OK()