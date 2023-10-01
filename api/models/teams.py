from firebase_admin import firestore
from helper.util import sha1_hash, make_secret
import datetime
from models.requests import (
    Team,
    TeamSimpleResponse,
    TeamRequest
)


class Teams:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def add_team(req: TeamRequest):
        # IDは適切に生成する
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        id = sha1_hash(req.name+timestamp)
        db = firestore.client()
        secret = make_secret(20)
        db.collection("teams").document(id).set(
            {
                "name": req.name,
                "year": req.year,
                "description": req.description,
                "members": req.members,
                "secret": secret
            }
        )
        db.collection("team_secrets").document(secret).set(
            {
                "id": id
            }
        )
        return Teams(id = id)

    @staticmethod
    def is_exist(team_id: str):
        db = firestore.client()
        doc = db.collection("teams").document(team_id).get()
        if doc.exists:
            return True
        else:
            return False

    @staticmethod
    def get_teams():
        db = firestore.client()
        docs = db.collection("teams").stream()
        data = {doc.id: doc.to_dict() for doc in docs}
        return data

    @staticmethod
    def get_by_secret(team_secret: str):
        db = firestore.client()
        doc = db.collection("team_secrets").document(team_secret).get()
        id = doc.get("id")
        data = db.collection("teams").document(id).get().to_dict()
        return data

    def get(self):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        return data

    def add_member(self, team_secret: str,  member_id: str):
        db = firestore.client()
        doc = db.collection("team_secrets").document(team_secret).get()
        if self.id != doc.get("id"):
            raise
        db.collection("teams").document(self.id).update(
            {
                "members": firestore.firestore.ArrayUnion([member_id])
            }
        )

    def update_name(self, name: str):
        db = firestore.client()
        db.collection("teams").document(self.id).update(
            {
                "name": name,
            }
        )

    def update_year(self, year: int):
        db = firestore.client()
        db.collection("teams").document(self.id).update(
            {
                "year": year,
            }
        )

    def update_description(self, description: str):
        db = firestore.client()
        db.collection("teams").document(self.id).update(
            {
                "description": description,
            }
        )

    def delete_member(self, member_id: str):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        if len(data["members"]) < 2:
            raise
        db.collection("teams").document(self.id).update(
            {
                "members": firestore.firestore.ArrayRemove([member_id])
            }
        )

    def get_members(self):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        return data["members"]