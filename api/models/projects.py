from firebase_admin import firestore
from helper.util import sha1_hash
import shutil
from typing import Optional
import tempfile
import os
import datetime
import imghdr
from firebase_admin import storage
import re
from models.requests import (
    ProjectInfo,
    ProjectRequest,
    RequiredSpec,
    ProjectDetails,
    ProjectReview,
    Install,
    ProjectSummary
)
from models.teams import Teams

class Project:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def create(req: ProjectRequest):
        # IDは適切に生成する，timestamp + team + name とか
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        id = sha1_hash(req.team + req.name + timestamp)
        db = firestore.client()
        db.collection("projects").document(id).set(
            {
                "team": req.team,
                "name": req.name,
                "rating": {
                    "total": 0,
                    "count": 0
                }
            }
        )
        return Project(id=id)

    @staticmethod
    def is_exist(id: str) -> bool:
        db = firestore.client()
        doc = db.collection("projects").document(id).get()
        if doc.exists:
            return True
        else:
            return False

    # project_info
    def get_info(self) -> ProjectInfo:
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        info = ProjectInfo(id=doc.id, **doc.to_dict())
        if info.icon is not None:
            info.icon = Project.gen_img_url(info.icon)
        if info.img is not None:
            info.img = Project.gen_img_url(info.img)
        info.details.img_screenshot = {img_id: Project.gen_img_url(path) for img_id, path in info.details.img_screenshot.items()}
        info.team = Teams(info.team).get_name()
        return info

    def set_name(self, name: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "name": name,
            }
        )

    def set_team(self, team: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "team": team,
            }
        )

    def get_team(self) -> str:
        db = firestore.client()
        team = db.collection("projects").document(self.id).get().get("team")
        return team

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

    def set_hidden(self, hidden: bool):
        db = firestore.client()
        db.collection("projects").document(self.id).set(
            {
                "hidden": hidden,
            }
        , merge=True)


    def set_icon(self, img):
        db = firestore.client()
        path  = os.path.join(self.id, f"icon.{imghdr.what(img)}")
        Project.save_img(path, img)
        db.collection("projects").document(self.id).set(
            {
                "icon": path,
            }
        , merge=True)


    def delete_icon(self):
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict()
        if "icon" in data:
            Project.drop_img(data["icon"])
        db.collection("projects").document(self.id).update(
            {
                "icon": firestore.DELETE_FIELD,
            }
        )

    def set_img(self, img):
        db = firestore.client()
        path  = os.path.join(self.id, f"img.{imghdr.what(img)}")
        Project.save_img(path, img)
        db.collection("projects").document(self.id).set(
            {
                "img": path,
            }
        , merge=True)

    def delete_img(self):
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict()
        if "img" in data:
            Project.drop_img(data["img"])
        db.collection("projects").document(self.id).update(
            {
                "img": firestore.DELETE_FIELD,
            }
        )

    # project_details
    def get_details(self) -> ProjectDetails:
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict().get("details", {})
        details = ProjectDetails(**data)
        details.img_screenshot = {img_id: Project.gen_img_url(path) for img_id, path in details.img_screenshot.items()}
        return details

    def add_img_screenshot(self, img):
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        img_id = sha1_hash(f"{self.id}{img}{timestamp}")

        db = firestore.client()
        path  = os.path.join(self.id, "img_screenshot", f"{img_id}.{imghdr.what(img)}")
        Project.save_img(path, img)
        db.collection("projects").document(self.id).update(
            {
                f"details.img_screenshot.{img_id}": path,
            }
        )

    def delete_img_screenshot(self, img_id: str):
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict()
        if "details" in data and "img_screenshot" in data["details"]:
            Project.drop_img(data["details"]["img_screenshot"][img_id])
        db.collection("projects").document(self.id).update(
            {
                f"details.img_screenshot.{img_id}": firestore.DELETE_FIELD,
            }
        )

    ## required_spec
    def add_required_spec(self, required_spec: RequiredSpec):
        db = firestore.client()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        spec_id = sha1_hash(f"{self.id}{required_spec}{timestamp}")

        db.collection("projects").document(self.id).update(
            {
                f"details.required_spec.{spec_id}": {
                    "item" : required_spec.item,
                    "required" : required_spec.required
                }
            }
        )

    def get_required_spec(self) -> {str: RequiredSpec}:
        db = firestore.client()
        required_spec = db.collection("projects").document(self.id).get().to_dict().get("details", {}).get("required_spec", {})
        return {key: RequiredSpec(**value) for key, value in required_spec.items()}

    def delete_required_spec(self, spec_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                f"details.required_spec.{spec_id}": firestore.DELETE_FIELD,
            }
        )

    ## install
    def get_install(self) -> {str, Install}:
        db = firestore.client()
        install = db.collection("projects").document(self.id).get().to_dict().get("details", {}).get("install", {})
        return {key: Install(**value) for key, value in install.items()}

    def add_install(self, install: Install):
        db = firestore.client()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        install_id = sha1_hash(f"{self.id}{install}{timestamp}")

        db.collection("projects").document(self.id).update(
            {
                f"details.install.{install_id}": {
                    "method" : install.method,
                    "info" : install.info,
                }
            }
        )
        if install.additional is not None:
            db.collection("projects").document(self.id).update(
                {
                    f"details.install.{install_id}.additional": install.additional
                }
            )

    def delete_install(self, install_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                f"details.install.{install_id}": firestore.DELETE_FIELD,
            }
        )

    ## forjob
    def set_forjob(self, forjob: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "details.forjob": forjob,
            }
        )

    def delete_forjob(self):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "details.forjob": firestore.DELETE_FIELD,
            }
        )

    # project_review
    def get_review(self) -> {str: ProjectReview}:
        db = firestore.client()
        review = db.collection("projects").document(self.id).get().to_dict().get("review", {})
        return {key: ProjectReview(**value) for key, value in review.items()}

    def add_review(self, review: ProjectReview):
        db = firestore.client()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        review_id = sha1_hash(f"{self.id}{review}{timestamp}")

        db.collection("projects").document(self.id).update(
            {
                f"review.{review_id}": {
                    "user": review.user,
                    "title": review.title,
                    "content": review.content,
                    "rating": review.rating
                },
                "rating.total": firestore.Increment(review.rating),
                "rating.count": firestore.Increment(1)
            }
        )


    def delete_review(self, review_id: str):
        db = firestore.client()
        review = self.get_review().get(review_id)
        db.collection("projects").document(self.id).update(
            {
                f"review.{review_id}": firestore.DELETE_FIELD,
                "rating.total": firestore.firestore.Increment(-review.rating),
                "rating.count": firestore.firestore.Increment(-1)
            }
        )

    # get_projectsの実装 by Yamamoto
    ## Projectのドキュメントを全てリストに集める
    ## 要求データは存在すると仮定
    @staticmethod
    def get_project(limit: int, page: int, order: Optional[str], year: Optional[int], team: Optional[str]):
        db = firestore.client()
        snapshot = db.collection("projects")

        if year is not None:
            docs = db.collection("teams").where(filter=firestore.firestore.FieldFilter("year", "==", year)).get()
            candidate = [doc.id for doc in docs]
            if len(candidate) > 0:
                snapshot = snapshot.where(filter=firestore.firestore.FieldFilter("team", "in", candidate))
            else:
                return dict()
        if team is not None:
            if Teams.is_exist(team):
                candidate = Teams(team).get_relations()
                snapshot = snapshot.where(filter=firestore.firestore.FieldFilter("team", "in", candidate))
            else:
                return dict()
        if order is None:
            st_doc = snapshot.limit(1 + limit * (page - 1)).get()[-1]
            snapshot = snapshot.start_at(st_doc).limit(limit)
        else:
            st_doc = snapshot.order_by(order).limit(1 + limit * (page - 1)).get()[-1]
            snapshot = snapshot.start_at(st_doc).order_by(order).limit(limit)

        def convert(data):
            data["team"] = Teams(data["team"]).get_name()
            return data

        docs =  snapshot.select(ProjectSummary.__annotations__.keys()).get()
        return {doc.id: convert(doc.to_dict()) for doc in docs}

    @staticmethod
    def allow_order(order: Optional[str]):
        return order is None or order in ["rating.total", "rating.count"]

    # delete_projectsの実装 by Yamamoto
    ## is_exist で存在確認済み
    def delete(self):
        db = firestore.client()
        db.collection("projects").document(self.id).delete()

    @staticmethod
    def gen_img_url(path: str):
        bucket = storage.bucket("mws-market.appspot.com")
        blob = bucket.blob(path)
        return blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(seconds=15),
            method="GET",
        )

    @staticmethod
    def save_img(path: str, img):
        bucket = storage.bucket("mws-market.appspot.com")
        blob = bucket.blob(path)
        with tempfile.NamedTemporaryFile(delete=True, dir=".", suffix=".stl") as tmp:
            shutil.copyfileobj(img, tmp)
            blob.upload_from_filename(tmp.name)

    @staticmethod
    def drop_img(path: str):
        bucket = storage.bucket("mws-market.appspot.com")
        blob = bucket.blob(path)
        if blob.exists():
            blob.delete()

    def get_youtube(self):
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict()
        return data.get("youtube")
