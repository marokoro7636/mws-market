from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

from helper.response import API_OK
from models.requests import Team, TeamSimpleResponse
from models.projects import Project
from models.teams import Teams


router = APIRouter()

@router.get("/", response_model=list[Team])
def get_teams():
    try:
        data = Teams.get_teams()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    return data

@router.post("/", response_model=TeamSimpleResponse)
def post_team(team: Team):
    try:
        res = Teams.add_team(team)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team")
    return TeamSimpleResponse(team_id = res.id)

@router.post("/{team_id}/name", response_model=API_OK)
def post_team_name(team_id: str, name: str):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Teams(team_id).update_name(name)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team name")
    return API_OK()

@router.post("/{team_id}/year", response_model=API_OK)
def post_team_year(team_id: str, year: int):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Teams(team_id).update_year(year)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team year")
    return API_OK()

@router.post("/{team_id}/description", response_model=API_OK)
def post_team_description(team_id: str, description: str):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Teams(team_id).update_description(description)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team description")
    return API_OK()

@router.delete("/{team_id}/members", response_model=API_OK)
def delete_team_members(team_id: str, member_id: str):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Teams(team_id).delete_member(member_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete team members")
    return API_OK()

@router.get("/invitation/{team_secret}", response_model=Team)
def get_team_with_secret(team_secret: str):
    try:
        data = Teams.get_by_secret(team_secret)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    return Team(**data)

@router.post("/invitation/{team_secret}", response_model=API_OK)
def post_team_members(team_secret: str, team_id: str, member_id: str):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Teams(team_id).add_member(team_secret, member_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team members")
    return API_OK()