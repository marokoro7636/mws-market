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
    SimpleSpecResponse
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

    # required_specに関して記述していく
    ## add function
    @staticmethod
    def add_project_required_spec(project_id, spec_id, required_spec):
        db = firestore.client()
        print(type(required_spec))
        db.collection("projects").document(project_id).collection("ProjectDetails").document(spec_id).set(
            {
                "item" : required_spec.item,
                "required" : required_spec.required
            }
        )

    ## get function
    @staticmethod
    def get_project_required_specs(project_id, spec_id):
        db = firestore.client()
        docs = db.collection("projects").document(project_id).collection("ProjectDetails").stream()
        # if not docs.exist:
        #   return None
        data = [{"spec_id": doc.id, "data" :doc.to_dict()} for doc in docs ]
        return data

    ## delete function
    @staticmethod
    def delete_project_required_spec(project_id, spec_id):
        db = firestore.client()
        # if not docs.exist:
        #   return None
        db.collection("projects").document(project_id).collection("ProjectDetails").document(spec_id).delete()
        return

    # get_projectsの実装 by Yamamoto
    ## Projectのドキュメントを全てリストに集める
    ## 要求データは存在すると仮定
    @staticmethod
    def get_projects():
        db = firestore.client()
        docs = db.collection("project").stream()
