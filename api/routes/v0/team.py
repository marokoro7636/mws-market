from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Optional
from fastapi import Header

from helper.auth import isAuthed
from helper.response import API_OK
from models.requests import (
    Team,
    TeamSimpleResponse,
    TeamRequest,
    TeamResponse
)
from models.teams import Teams
from models.users import Users


router = APIRouter()

@router.get("/", response_model=list[TeamResponse])
def get_teams():
    try:
        data = Teams.get_teams()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    return [TeamResponse(id=key, **value) for key, value in data.items()]

@router.post("/", response_model=TeamSimpleResponse)
def post_team(req: TeamRequest, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed(req.members, x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Users.are_exist(req.members):
        raise StarletteHTTPException(status_code=404, detail="User not found")
    try:
        res = Teams.add_team(req)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team")
    return TeamSimpleResponse(id = res.id)

@router.get("/{team_id}", response_model=Team)
def get_team(team_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(team_id).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")

    try:
        data = Teams(team_id).get()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    return Team(**data)

@router.post("/{team_id}/name", response_model=API_OK)
def post_team_name(team_id: str, name: str, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(team_id).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")

    try:
        Teams(team_id).update_name(name)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team name")
    return API_OK()

@router.post("/{team_id}/year", response_model=API_OK)
def post_team_year(team_id: str, year: int, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(team_id).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Teams(team_id).update_year(year)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team year")
    return API_OK()

@router.post("/{team_id}/description", response_model=API_OK)
def post_team_description(team_id: str, description: str, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(team_id).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Teams(team_id).update_description(description)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team description")
    return API_OK()

@router.delete("/{team_id}/members", response_model=API_OK)
def delete_team_members(team_id: str, member_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(team_id).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Teams(team_id).delete_member(member_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete team members")
    return API_OK()

@router.post("/{team_id}/relations", response_model=API_OK)
def post_team_relations(team_id: str, secret: str, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(team_id).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")

    team =  Teams.get_by_secret(secret)
    if team is None:
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        Teams(team_id).set_relations(team)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team relations")
    return API_OK()

@router.delete("/{team_id}/relations", response_model=API_OK)
def delete_team_relations(team_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Teams.is_exist(team_id):
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    if not isAuthed(Teams(team_id).get_members(), x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Teams(team_id).delete_relations()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to delete team relations")
    return API_OK()

@router.get("/invitation/{team_secret}", response_model=Team)
def get_team_with_secret(team_secret: str):
    id =  Teams.get_by_secret(team_secret)
    if id is None:
        raise StarletteHTTPException(status_code=404, detail="Team not found")
    try:
        data = Teams(id).get()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    return Team(**data)

@router.post("/invitation/{team_secret}", response_model=API_OK)
def post_team_members(team_secret: str, member_id: str, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed([member_id], x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Users.is_exist(member_id):
        raise StarletteHTTPException(status_code=404, detail="User not found")

    id =  Teams.get_by_secret(team_secret)
    if id is None:
        raise StarletteHTTPException(status_code=404, detail="Team not found")

    try:
        Teams(id).add_member(member_id)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post team members")
    return API_OK()