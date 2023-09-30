from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from helper.util import sha1_hash
import datetime

from helper.response import API_OK

from models.requests import Team


router = APIRouter()

@router.get("/", response_model=list[Team])
def get_team():
    # try:
    #     data = db.get_teams()
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    data = Team(
            name="Team1",
            year=2021,
            description="Team1 description",
            members=["member1", "member2"],
            secret="nijfdhuif428942rr43huifrehuig3y894",
        )
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

@router.delete("/{team_id}/members", response_model=API_OK)
def delete_team_members(team_id: str, member_id: str):
    # if db.get_team_by_id(team_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Team not found")
    # try:
    #     db.delete_team_member(team_id, member_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to delete team members")
    return API_OK()

@router.get("/invitation/{team_secret}", response_model=Team)
def get_team_with_secret(team_secret: str):
    # try:
    #     data = db.get_teams_by_secret(team_secret)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to get teams")
    data = Team(
            name="Team1",
            year=2021,
            description="Team1 description",
            members=["member1", "member2"],
            secret="nijfdhuif428942rr43huifrehuig3y894",
        )
    return data

@router.post("/invitation/{team_secret}", response_model=API_OK)
def post_team_members(team_secret: str, member_id: str):
    # if db.get_team_by_id(team_id) is None:
    #     raise StarletteHTTPException(status_code=404, detail="Team not found")
    # try:
    #     db.add_team_member(team_secret, member_id)
    # except:
    #     raise StarletteHTTPException(status_code=500, detail="Failed to post team members")
    return API_OK()
