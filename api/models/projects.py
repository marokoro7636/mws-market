from firebase_admin import firestore
from helper.util import sha1_hash
import base64
import shutil
import tempfile
from fastapi import UploadFile
import re
from models.requests import (
    ProjectInfo,
    ProjectRequest,
    RequiredSpec,
    SimpleSpecResponse
)

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

    # project_info
    def get_info(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        return ProjectInfo(**doc.to_dict())

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

    def set_icon(self, img: UploadFile):
        db = firestore.client()
        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            data = base64.b64encode(tmp.read())

        db.collection("projects").document(self.id).set(
            {
                "icon": base64.b64encode(data),
            }
        , merge=True)

    def delete_icon(self):
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict()
        if "icon" in data:
            db.collection("projects").document(self.id).update(
                {
                    "icon": firestore.DELETE_FIELD,
                }
            )

    def set_img(self, img: UploadFile):
        db = firestore.client()
        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            data = base64.b64encode(tmp.read())

        db.collection("projects").document(self.id).set(
            {
                "img": base64.b64encode(data),
            }
        , merge=True)

    def delete_img(self):
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict()
        if "img" in data:
            db.collection("projects").document(self.id).update(
                {
                    "img": firestore.DELETE_FIELD,
                }
            )

    # project_detail
    def add_img_screenshot(self, img_id: str, img: UploadFile):
        db = firestore.client()
        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            data = base64.b64encode(tmp.read())

        db.collection("projects").document(self.id).collection("ProjectDetails").document("img_screenshot").collection("list").document(img_id).set(
            {
                "img": base64.b64encode(data),
            }
        )

    def delete_img_screenshot(self, img_id: str):
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
        db.collection("projects").document(self.id).collection("ProjectDetails").document("required_spec").collection("list").document(spec_id).delete()

    # get_projectsの実装 by Yamamoto
    ## Projectのドキュメントを全てリストに集める
    ## 要求データは存在すると仮定
    @staticmethod
    def get_projects():
        db = firestore.client()
        docs = db.collection("project").stream()
