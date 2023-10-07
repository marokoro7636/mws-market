from firebase_admin import firestore
from helper.util import sha1_hash, make_secret
from helper.sanitize import sanitizing_id, sanitizing_by_html, sanitizing_str, sanitizing_int
import datetime
from models.requests import (
    Team,
    TeamSimpleResponse,
    TeamRequest,
    TeamResponse
)


class Teams:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def add_team(req: TeamRequest):
        req.name = sanitizing_by_html(req.name)
        if req.description is not None:
            req.description = sanitizing_by_html(req.description)
            if not sanitizing_str(req.description, 100):
                raise
        if sanitizing_str(req.name, 100) and sanitizing_int(req.year, 4): 
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
                    "year": req.year,
                    "description": req.description,
                    "members": members,
                    "secret": secret,
                    "relations": [
                        id,
                    ]
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
        team_id = sanitizing_by_html(team_id)
        if sanitizing_str(team_id, 40):
            db = firestore.client()
            doc = db.collection("teams").document(team_id).get()
            if doc.exists:
                return True
            else:
                return False
        else:
            return False

    @staticmethod
    def get_teams():
        db = firestore.client()
        docs = db.collection("teams").stream()
        teams = [TeamResponse(id=doc.id, **doc.to_dict()) for doc in docs]
        return teams

    @staticmethod
    def get_by_secret(secret: str):
        db = firestore.client()
        doc = db.collection("secrets").document(secret).get()
        id = doc.get("id")
        return id

    def get(self):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        data["id"] = self.id
        teams = self.get_teams()
        relations = []
        for id in data["relations"]:
            # if id == self.id:
            #     continue
            for team in teams:
                if team.id == id:
                    relations.append(team)
        for i in range(len(relations)):
            relations[i].relations = []
        data["relations"] = relations
        return data

    def get_name(self):
        db = firestore.client()
        name = db.collection("teams").document(self.id).get().get("name")
        return name

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
        if sanitizing_str(name, 100):
            db = firestore.client()
            db.collection("teams").document(self.id).update(
                {
                    "name": name,
                }
            )
        else:
            raise

    def update_year(self, year: int):
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
        if sanitizing_str(description, 100):
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
        updated_data = list(filter(lambda x: x["id"] != user_id, data["members"]))
        db.collection("teams").document(self.id).update(
            {
                "members": updated_data
            }
        )
        db.collection("affiliations").document(user_id).update(
            {
                "team": firestore.firestore.ArrayRemove([self.id])
            }
        )

    def set_relations(self, team: str):
        db = firestore.client()
        relations = db.collection("teams").document(self.id).get().to_dict().get("relations")
        relations += db.collection("teams").document(team).get().to_dict().get("relations")
        for id in relations:
            db.collection("teams").document(id).update(
                {
                    "relations": relations
                }
            )

    def delete_relations(self):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        relations = data.get("relations")
        relations.remove(self.id)
        for id in relations:
            db.collection("teams").document(id).update(
                {
                    "relations": relations,
                }
            )
        db.collection("teams").document(self.id).update(
            {
                "relations": [self.id],
            }
        )

    def get_relations(self):
        db = firestore.client()
        relations = db.collection("teams").document(self.id).get().get("relations")
        return relations

    def get_members(self):
        db = firestore.client()
        data = db.collection("teams").document(self.id).get().to_dict()
        return list(map(lambda x: x["id"],  data["members"]))


    def set_project(self, project: str):
        project = sanitizing_by_html(project)
        if sanitizing_str(project, 100):
            db = firestore.client()
            db.collection("teams").document(self.id).update(
                {
                    "project": project,
                }
            )
        else:
            raise
        
    def get_project(self):
        db = firestore.client()
        project = db.collection("teams").document(self.id).get().to_dict().get("project")
        return project