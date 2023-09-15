from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

from helper.response import API_OK

router = APIRouter()

class Team(BaseModel):
    name: str
    year: int
    description: str
    members: list[str]

@router.get("/", response_model=list[Team])
def get_teams():
    # try:
    #     data = db.get_teams()
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    data = [
        Team(
            name="Team1",
            year=2021,
            description="Team1 description",
            members=["member1", "member2"],
        ),
        Team(
            name="Team2",
            year=2021,
            description="Team2 description",
            members=["member1", "member2"],
        ),
    ]
    return data

@router.post("/", response_model=API_OK)
def post_team(team: Team):
    # try:
    #     db.add_team(team)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post team")
    return API_OK()

@router.post("/{team_id}/name", response_model=API_OK)
def post_team_name(team_id: str, name: str):
    # if db.get_team_by_id(team_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Team not found")
    # try:
    #     db.update_team_name(team_id, name)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post team name")
    return API_OK()

@router.post("/{team_id}/year", response_model=API_OK)
def post_team_year(team_id: str, year: int):
    # if db.get_team_by_id(team_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Team not found")
    # try:
    #     db.update_team_year(team_id, year)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post team year")
    return API_OK()

@router.post("/{team_id}/description", response_model=API_OK)
def post_team_description(team_id: str, description: str):
    # if db.get_team_by_id(team_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Team not found")
    # try:
    #     db.update_team_description(team_id, description)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post team description")
    return API_OK()

@router.post("/{team_id}/members", response_model=API_OK)
def post_team_members(team_id: str, member_id: list[str]):
    # if db.get_team_by_id(team_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Team not found")
    # try:
    #     db.add_team_members(team_id, member_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post team members")
    return API_OK()