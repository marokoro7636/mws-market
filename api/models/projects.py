from firebase_admin import firestore
from helper.util import sha1_hash
import shutil
import tempfile
import os
import datetime
import imghdr
from fastapi import UploadFile
from firebase_admin import storage
import re
from models.requests import (
    ProjectInfo,
    ProjectRequest,
    RequiredSpec,
    ProjectDetails,
    SimpleSpecResponse,
    Team,
    TeamSimpleResponse,
    ProjectReview,
    Install
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
        return {
            "id": self.id,
            "name": self.get_name(),
            "team": self.get_team(),
            "short_description": self.get_short_description(),
            "description": self.get_description(),
            "youtube": self.get_youtube(),
            "details": self.get_details(),
            "demo": None,
            "review": self.get_review(),
            "isIndex": self.get_index(),
            "icon": self.get_icon(),
            "img": self.get_img()
        }

    def set_name(self, name: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "name": name,
            }
        )

    def get_name(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()

        return doc.to_dict()["name"]

    def set_team(self, team: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "team": team,
            }
        )

    def get_team(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()

        return doc.to_dict()["team"]

    def set_short_description(self, short_description: str):
        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "short_description": short_description,
            }
        , merge=True)

    def get_short_description(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "short_description" in doc.to_dict():
            return doc.to_dict()["short_description"]
        else:
            return None

    def set_description(self, description: str):
        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "description": description,
            }
        , merge=True)

    def get_description(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "description" in doc.to_dict():
            return doc.to_dict()["description"]
        else:
            return None

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

    def get_youtube(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "youtube" in doc.to_dict():
            return doc.to_dict()["youtube"]
        else:
            return None

    def set_index(self, is_hidden: bool):
        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "isIndex": not is_hidden,
            }
        , merge=True)

    def get_index(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "isIndex" in doc.to_dict():
            return doc.to_dict()["isIndex"]
        else:
             return None

    def set_icon(self, img: UploadFile):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        path  = os.path.join(self.id, f"icon.{imghdr.what(img.file)}")
        blob = bucket.blob(path)

        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            blob.upload_from_filename(tmp.name)
        db.collection("projects").document(self.id).set(
            {
                "icon": path,
            }
        , merge=True)

    def get_icon(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "icon" in doc.to_dict():
            path = doc.to_dict()["icon"]
            bucket = storage.bucket("mws-market.appspot.com")
            blob = bucket.blob(path)

            return blob.generate_signed_url(
                version="v4",
                expiration=datetime.timedelta(seconds=60),
                method="GET",
            )
        else:
            return None


    def delete_icon(self):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        path  = os.path.join(self.id, "icon")
        blob = bucket.blob(path)
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
        path  = os.path.join(self.id, f"img.{imghdr.what(img.file)}")
        blob = bucket.blob(path)

        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            blob.upload_from_filename(tmp.name)
        db.collection("projects").document(self.id).set(
            {
                "img": path,
            }
        , merge=True)

    def delete_img(self):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        path  = os.path.join(self.id, "img")
        blob = bucket.blob(path)
        if blob.exists():
            blob.delete()
        db.collection("projects").document(self.id).update(
            {
                "img": firestore.DELETE_FIELD,
            }
        )

    def get_img(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "img" in doc.to_dict():
            path = doc.to_dict()["img"]
            bucket = storage.bucket("mws-market.appspot.com")
            blob = bucket.blob(path)

            return blob.generate_signed_url(
                version="v4",
                expiration=datetime.timedelta(seconds=60),
                method="GET",
            )
        else:
            return None

    # project_detail
    def get_details(self):
        return {
            "img_screenshot": self.get_img_screenshot(),
            "required_spec": self.get_required_spec(),
            "install": self.get_install(),
            "forjob": self.get_forjob()
        }

    def add_img_screenshot(self, img: UploadFile):
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        img_id = sha1_hash(f"{self.id}{img}{timestamp}")

        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        path  = os.path.join(self.id, "img_screenshot", f"{img_id}.{imghdr.what(img.file)}")
        blob = bucket.blob(path)

        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img.file, tmp)
            blob.upload_from_filename(tmp.name)

        db.collection("projects").document(self.id).update(
            {
                f"ProjectDetails.img_screenshot.{img_id}": path,
            }
        )

    def delete_img_screenshot(self, img_id: str):
        db = firestore.client()
        bucket = storage.bucket("mws-market.appspot.com")
        path  = os.path.join(self.id, "img_screenshot", img_id)
        blob = bucket.blob(path)
        if blob.exists():
            blob.delete()
        db.collection("projects").document(self.id).update(
            {
                f"ProjectDetails.img_screenshot.{img_id}": firestore.DELETE_FIELD,
            }
        )
    def get_img_screenshot(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()

        if "ProjectDetails" in doc.to_dict() and "img_screenshot" in doc.to_dict()["ProjectDetails"]:
            data = dict()
            for img_id, path in doc.to_dict()["ProjectDetails"]["img_screenshot"].items():
                bucket = storage.bucket("mws-market.appspot.com")
                blob = bucket.blob(path)
                data[img_id] = blob.generate_signed_url(
                    version="v4",
                    expiration=datetime.timedelta(seconds=60),
                    method="GET",
                )
            return data
        else:
            return dict()

    ## required_spec
    def add_required_spec(self, required_spec: RequiredSpec):
        db = firestore.client()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        spec_id = sha1_hash(f"{self.id}{required_spec}{timestamp}")

        db.collection("projects").document(self.id).update(
            {
                f"ProjectDetails.required_spec.{spec_id}": {
                    "item" : required_spec.item,
                    "required" : required_spec.required
                }
            }
        )

    def get_required_spec(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "ProjectDetails" in doc.to_dict() and "required_spec" in doc.to_dict()["ProjectDetails"]:
            return doc.to_dict()["ProjectDetails"]["required_spec"]
        else:
            return dict()

    def delete_required_spec(self, spec_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                f"ProjectDetails.required_spec.{spec_id}": firestore.DELETE_FIELD,
            }
        )

    ## install
    def get_install(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "ProjectDetails" in doc.to_dict() and "install" in doc.to_dict()["ProjectDetails"]:
            return doc.to_dict()["ProjectDetails"]["install"]
        else:
            return dict()

    def add_install(self, install: Install):
        db = firestore.client()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        install_id = sha1_hash(f"{self.id}{install}{timestamp}")

        db.collection("projects").document(self.id).update(
            {
                f"ProjectDetails.install.{install_id}": {
                    "method" : install.method,
                    "info" : install.info,
                }
            }
        )
        if install.additional is not None:
            db.collection("projects").document(self.id).update(
                {
                    f"ProjectDetails.install.{install_id}.additional": install.additional
                }
            )

    def delete_install(self, install_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                f"ProjectDetails.install.{install_id}": firestore.DELETE_FIELD,
            }
        )

    ## forjob
    def get_forjob(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "ProjectDetails" in doc.to_dict() and "forjob" in doc.to_dict()["ProjectDetails"]:
            return doc.to_dict()["ProjectDetails"]["forjob"]
        else:
            return None

    def set_forjob(self, forjob: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "ProjectDetails.forjob": forjob,
            }
        )

    def delete_forjob(self):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "ProjectDetails.forjob": firestore.DELETE_FIELD,
            }
        )

    # project_review
    def get_review(self):
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        if "ProjectReview" in doc.to_dict():
            return doc.to_dict()["ProjectReview"]
        else:
            return dict()

    def add_review(self, review: ProjectReview):
        db = firestore.client()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        review_id = sha1_hash(f"{self.id}{review}{timestamp}")

        db.collection("projects").document(self.id).update(
            {
                f"ProjectReview.{review_id}": {
                    "title": review.title,
                    "content": review.content,
                    "rating": review.rating
                }
            }
        )

    def delete_review(self, review_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                f"ProjectReview.{review_id}": firestore.DELETE_FIELD,
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
