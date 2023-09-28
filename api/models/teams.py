from firebase_admin import firestore
from helper.util import sha1_hash
from urllib.request import urlopen
import base64
import shutil
import tempfile
import imghdr
from fastapi import UploadFile
import re
from models.requests import (
    ProjectInfo,
    ProjectRequest,
    RequiredSpec,
    SimpleSpecResponse,
    Team,
    TeamSimpleResponse,
)


class Teams:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def add_team(team: Team):
        # IDは適切に生成する
        id = sha1_hash(team.name)
        db = firestore.client()
        db.collection("Teams").document(id).set(
            {
                "name": team.name,
                "year": team.year,
                "description": team.description,
                "members": team.members,
            }
        )
        return TeamSimpleResponse(team_id = id)
    
    @staticmethod
    def get_teams():
        db = firestore.client()
        docs = db.collection("Teams").stream()
        data = [Team(name = doc.get("name"),year = doc.get("year"), description = doc.get("description"), members = doc.get("members")) for doc in docs]
        return data
    @staticmethod
    def update_team_name(team_id: str, name: str):
        db = firestore.client()
        db.collection("Teams").document(team_id).update(
            {
                "name": name,
            }
        )
    @staticmethod
    def update_team_year(team_id: str, year: int):
        db = firestore.client()
        db.collection("Teams").document(team_id).update(
            {
                "year": year,
            }
        )
    @staticmethod
    def update_team_description(team_id: str, description: str):
        db = firestore.client()
        db.collection("Teams").document(team_id).update(
            {
                "description": description,
            }
        )
    @staticmethod
    def add_team_members(team_id: str, new_members: list[str]):
        db = firestore.client()
        print("check")
        print(db.collection("Teams").document(team_id).get().to_dict())
        db.collection("Teams").document(team_id).update(
            {
                "members": firestore.ArrayUnion(new_members)
            }
        )
    @staticmethod
    def get_team_by_id(team_id):
        db = firestore.client()
        doc = db.collection("Teams").document(team_id).get()
        if doc.exists:
            return TeamSimpleResponse(team_id = team_id)
        else:
            return None