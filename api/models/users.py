from firebase_admin import firestore
from helper.util import sha1_hash, make_secret
from helper.sanitize import sanitizing_id
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
        if sanitizing_id(user_id):
            db = firestore.client()
            doc = db.collection("users").document(user_id).get()
            if doc.exists:
                return True
            else:
                return False
        else:
            return False

    @staticmethod
    def are_exist(user_id: list[str]):
        return all([Users.is_exist(x) for x in user_id])

    def get(self) -> User:
        db = firestore.client()
        name = db.collection("users").document(self.id).get().get("name")
        team = db.collection("affiliations").document(self.id).get().get("team")
        return User(**{"id": self.id, "name": name, "team": team})
