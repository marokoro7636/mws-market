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

# 許可する画像の種類
# 参考: https://docs.python.org/ja/3/library/imghdr.html
ALLOW_IMAGE_FORMAT = ["png", "jpeg", "bmp"]

# 許可する画像の最大サイズ(byte)
ALLOW_IMAGE_SIZE = 2 * 1024 * 1024

class Project:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def create(team, name):
        # IDは適切に生成する，timestamp + team + name とか
        id = sha1_hash(team + name)
        db = firestore.client()
        db.collection("projects").document(id).set(
            {
                "id": id,
                "team": team,
                "name": name,
            }
        )
        return Project(id=id)


    @staticmethod
    def load_by_id(id: str):
        db = firestore.client()
        doc = db.collection("projects").document(id).get()
        if doc.exists:
            return Project(id=id)
        else:
            return None

    @staticmethod
    def is_exist(id: str):
        db = firestore.client()
        doc = db.collection("projects").document(id).get()
        if doc.exists:
            return True
        else:
            return False

    @staticmethod
    def check_img(img: UploadFile):
        img_format = imghdr.what(img.file)
        img.file.seek(0, 2)
        img_size = img.file.tell()

        if img_format in ALLOW_IMAGE_FORMAT and img_size <= ALLOW_IMAGE_SIZE:
            return True
        else:
            return False


    def get_info(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        return ProjectInfo(**doc.to_dict())


    # project_info
    def set_name(self, name: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "name": name,
            }
        )

    def set_short_description(self, short_description: str):
        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "short_description": short_description,
            }
        , merge=True)

    def set_description(self, description: str):
        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "description": description,
            }
        , merge=True)

    def set_youtube(self, youtube: str):
        # YoutubeのURLか
        if re.match(r'https?:\/\/(www.youtube.com\/|youtu.be\/)(\w+)', youtube) is None:
            raise

        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "youtube": youtube,
            }
        , merge=True)

    def delete_youtube(self):
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict()
        if "youtube" in data:
            db.collection("projects").document(self.id).update(
                {
                    "youtube": firestore.DELETE_FIELD,
                }
            )

    def set_index(self, is_hidden: bool):
        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "isIndex": not is_hidden,
            }
        , merge=True)

    # project_detail
    def add_img(self, img_id: str, img: UploadFile):
        db = firestore.client()
        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            data = base64.b64encode(tmp.read())

        db.collection("projects").document(self.id).collection("ProjectDetails").document("img_screenshot").collection("list").document(img_id).set(
            {
                "img_id": img_id,
                "img": base64.b64encode(data),
            }
        )

    def delete_img(self, img_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).collection("ProjectDetails").document("img_screenshot").collection("list").document(img_id).delete()

    ## required_spec
    def add_required_spec(self, spec_id: str, required_spec: RequiredSpec):
        db = firestore.client()
        db.collection("projects").document(self.id).collection("ProjectDetails").document("required_spec").collection("list").document(spec_id).set(
            {
                "item" : required_spec.item,
                "required" : required_spec.required
            }
        )

    def get_required_specs(self):
        db = firestore.client()
        docs = db.collection("projects").document(self.id).collection("ProjectDetails").document("required_spec").collection("list").stream()
        data = [SimpleSpecResponse(spec_id=doc.id, data=doc.to_dict()) for doc in docs]
        return data

    def delete_required_spec(self, spec_id: str):
        db = firestore.client()
        docs = db.collection("projects").document(self.id).collection("ProjectDetails").document("required_spec").collection("list").document(spec_id).get()
        if not docs.exist():
            raise
        db.collection("projects").document(self.id).collection("ProjectDetails").document("required_spec").collection("list").document(spec_id).delete()

    #team.pyに関連するメソッド
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


    # get_projectsの実装 by Yamamoto
    ## Projectのドキュメントを全てリストに集める
    ## 要求データは存在すると仮定
    @staticmethod
    def get_projects():
        db = firestore.client()
        docs = db.collection("projects").stream()
        data = [{"name":doc.name, "description":doc.description} for doc in docs]
        return data

    # get_project_by_idの実装 by Yamamoto
    ## is_exist で存在確認済み
    def get_project_by_id(project_id: str):
        db = firestore.client()
        doc = db.collection("projects").document(project_id).get()
        return ProjectInfo(**doc.to_dict())

    # delete_projectsの実装 by Yamamoto
    ## is_exist で存在確認済み
    @staticmethod
    def delete_project(project_id: str):
        db = firestore.client()
        db.collection("projects").document(project_id).delete()
