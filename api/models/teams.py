from firebase_admin import firestore
from helper.util import sha1_hash, make_secret
from helper.sanitize import sanitizing_id, sanitizing_by_html, sanitizing_str, sanitizing_int
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
        req.name = sanitizing_by_html(req.name) 
        if req.description is not None: # 不安箇所
            req.description = sanitizing_by_html(req.description)
            if not sanitizing_str(req.description, 20):
                raise
        if sanitizing_str(req.name, 20) and sanitizing_int(req.year, 4): 
            # IDは適切に生成する
            timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            id = sha1_hash(req.name+timestamp)
            db = firestore.client()
            secret = make_secret(20)
            members = []
            for user_id in req.members:
                user = db.collection("users").document(user_id).get()
                if not user.exists:
                    print("user not found")
                    raise
                user = user.to_dict()
                members.append({
                    "id": user_id,
                    "name": user["name"],
                    "image": user["image"]
                })
            db.collection("teams").document(id).set(
                {
                    "name": req.name,
                    "year": req.year, # int 型 None?
                    "description": req.description, # None?
                    "members": members, # 関数内で生成
                    "secret": secret, # 関数内で生成
                    "previous": None
                }
            )
            db.collection("secrets").document(secret).set(
                {
                    "id": id
                }
            )
            for user_id in req.members:
                db.collection("affiliations").document(user_id).set(
                    {
                       "team": firestore.firestore.ArrayUnion([id])
                    }
                , merge=True)
            return Teams(id = id)
        else:
            raise

    @staticmethod
    def is_exist(team_id: str):
        if sanitizing_id(team_id):
            db = firestore.client()
            doc = db.collection("teams").document(team_id).get()
            if doc.exists:
                return True
            else:
                return False
        return False

    @staticmethod
    def get_teams():
        db = firestore.client()
        docs = db.collection("teams").stream()
        data = {doc.id: doc.to_dict() for doc in docs}
        return data

    @staticmethod
    def get_by_secret(secret: str):
        db = firestore.client()
        doc = db.collection("secrets").document(secret).get()
        id = doc.get("id")
        return id

    def get(self):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        return data

    def add_member(self, user_id: str):
        db = firestore.client()
        user = db.collection("users").document(user_id).get()
        if not user.exists:
            print("user not found")
            raise
        user = user.to_dict()
        db.collection("teams").document(self.id).update(
            {
                "members": firestore.firestore.ArrayUnion([{
                    "id": user_id,
                    "name": user["name"],
                    "image": user["image"],
                }])
            }
        )
        db.collection("affiliations").document(user_id).set(
            {
                "team": firestore.firestore.ArrayUnion([self.id])
            }
        , merge=True)

    def update_name(self, name: str):
        name = sanitizing_by_html(name)
        if sanitizing_str(name, 20):
            db = firestore.client()
            db.collection("teams").document(self.id).update(
                {
                    "name": name,
                }
            )
        else:
            raise

    def update_year(self, year: int): # int 型
        if sanitizing_int(year, 4):
            db = firestore.client()
            db.collection("teams").document(self.id).update(
                {
                    "year": year,
                }
            )
        else:
            raise

    def update_description(self, description: str):
        description = sanitizing_by_html(description)
        if sanitizing_str(description, 20):
            db = firestore.client()
            db.collection("teams").document(self.id).update(
                {
                    "description": description,
                }
            )
        else:
            raise

    def delete_member(self, user_id: str):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        if len(data["members"]) < 2:
            print("members is less than 2")
            raise
        del_data = list(filter(lambda x: x["id"] == user_id, data["members"]))
        if len(del_data) == 0:
            print("user not found in teams")
            raise
        db.collection("teams").document(self.id).update(
            {
                "members": firestore.firestore.ArrayRemove([del_data])
            }
        )
        db.collection("affiliations").document(user_id).update(
            {
                "team": firestore.firestore.ArrayRemove([self.id])
            }
        )

    def set_previous(self, previous: str):
        previous = sanitizing_by_html(previous)
        if sanitizing_str(previous, 20):
            db = firestore.client()
            db.collection("teams").document(self.id).update(
                {
                    "previous": previous,
                }
            )
        else:
            raise

    def delete_previous(self):
        db = firestore.client()
        db.collection("teams").document(self.id).update(
            {
                "previous": firestore.DELETE_FIELD,
            }
        )

    def get_members(self):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        return list(map(lambda x: x["id"],  data["members"]))