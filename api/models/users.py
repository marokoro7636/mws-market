from firebase_admin import firestore
from helper.util import sha1_hash, make_secret
import datetime
from models.requests import(
    User,
    UserRequest,
)

class Users:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def is_exist(user_id: str):
        db = firestore.client()
        doc = db.collection("users").document(user_id).get()
        if doc.exists:
            return True
        else:
            return False

    @staticmethod
    def are_exist(user_id: list[str]):
        return all([Users.is_exist(x) for x in user_id])

    def get(self):
        db = firestore.client()
        name = db.collection("users").document(self.id).get().get("name")
        team = db.collection("affiliations").document(self.id).get().get("team")
        return {"name": name, "team": team}
