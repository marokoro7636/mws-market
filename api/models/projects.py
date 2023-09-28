from firebase_admin import firestore
from helper.util import sha1_hash
import base64
import shutil
import tempfile
import os
import datetime
from fastapi import UploadFile
from firebase_admin import storage
import re
from models.requests import (
    ProjectInfo,
    ProjectRequest,
    RequiredSpec,
    SimpleSpecResponse,
    Team,
    TeamSimpleResponse,
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
        bucket = storage.bucket("mws-market.appspot.com")
        dst_path  = os.path.join(self.id, "icon")
        blob = bucket.blob(dst_path)

        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            blob.upload_from_filename(tmp.name)
        db.collection("projects").document(self.id).set(
            {
                "icon": os.path.join("gs://mws-market.appspot.com/", dst_path),
            }
        , merge=True)

    def delete_icon(self):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        dst_path  = os.path.join(self.id, "icon")
        blob = bucket.blob(dst_path)
        if blob.exists():
            blob.delete()
        db.collection("projects").document(self.id).update(
            {
                "icon": firestore.DELETE_FIELD,
            }
        )

    def set_img(self, img: UploadFile):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        dst_path  = os.path.join(self.id, "img")
        blob = bucket.blob(dst_path)

        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            blob.upload_from_filename(tmp.name)
        db.collection("projects").document(self.id).set(
            {
                "img": os.path.join("gs://mws-market.appspot.com/", dst_path),
            }
        , merge=True)

    def delete_img(self):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        dst_path  = os.path.join(self.id, "img")
        blob = bucket.blob(dst_path)
        if blob.exists():
            blob.delete()
        db.collection("projects").document(self.id).update(
            {
                "img": firestore.DELETE_FIELD,
            }
        )

    # project_detail
    def add_img_screenshot(self, img: UploadFile):
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        img_id = sha1_hash(f"{self.id}{img}{timestamp}")

        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        dst_path  = os.path.join(self.id, "img_screenshot", img_id)
        blob = bucket.blob(dst_path)

        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            blob.upload_from_filename(tmp.name)

        db.collection("projects").document(self.id).update(
            {
                "ProjectDetails.img_screenshot."+img_id: os.path.join("gs://mws-market.appspot.com/", dst_path),
            }
        )

    def delete_img_screenshot(self, img_id: str):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        dst_path  = os.path.join(self.id, "img_screenshot", img_id)
        blob = bucket.blob(dst_path)
        if blob.exists():
            blob.delete()
        db.collection("projects").document(self.id).update(
            {
                "ProjectDetails.img_screenshot."+img_id: firestore.DELETE_FIELD,
            }
        )

    ## required_spec
    def add_required_spec(self, spec_id: str, required_spec: RequiredSpec):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "ProjectDetails.required_spec."+spec_id: {
                    "item" : required_spec.item,
                    "required" : required_spec.required
                }
            }
        )

    def get_required_specs(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        data = doc.to_dict()
        ret = [SimpleSpecResponse(spec_id=key, data=value) for key, value in data["ProjectDetails"]["required_spec"].items()]
        return ret

    def delete_required_spec(self, spec_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "ProjectDetails.required_spec."+spec_id: firestore.DELETE_FIELD,
            }
        )
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
