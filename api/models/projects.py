from firebase_admin import firestore
from helper.util import sha1_hash
from helper.sanitize import sanitizing_id, sanitizing_by_html, sanitizing_str, sanitizing_int
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
    ProjectReviewRequest,
    Install,
    ProjectSummary,
    RequiredSpecRequest,
    ImgScreenshot
)
from models.teams import Teams

class Project:
    def __init__(self, id):
        self.id = id

    @staticmethod
    def create(req: ProjectRequest):
        req.name = sanitizing_by_html(req.name)
        if sanitizing_str(req.name, 100):
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
            Teams(req.team).set_project(id)
            return Project(id=id)
        else:
            raise

    @staticmethod
    def is_exist(id: str) -> bool:
        if sanitizing_id(id):
            db = firestore.client()
            doc = db.collection("projects").document(id).get()
            if doc.exists:
                return True
            else:
                return False
        else:
            raise

    # project_info
    def get_info(self) -> ProjectInfo:
        db = firestore.client()
        doc = db.collection("projects").document(self.id).get()
        info = ProjectInfo(id=doc.id, **doc.to_dict())
        if info.icon is not None:
            info.icon = Project.gen_img_url(info.icon)
        info.details.img_screenshot = [ImgScreenshot(id=img_screenshot.id, path=Project.gen_img_url(img_screenshot.path)) for img_screenshot in info.details.img_screenshot]
        if len(info.details.img_screenshot) > 0:
            info.img = info.details.img_screenshot[0]
        info.previous = Project.get_project(team=info.team, include=False)
        info.team_id = info.team
        info.team = Teams(info.team).get_name()
        return info

    def set_name(self, name: str):
        name = sanitizing_by_html(name)
        if sanitizing_str(name, 100):
            db = firestore.client()
            db.collection("projects").document(self.id).update(
                {
                    "name": name,
                }
            )
        else:
            raise

    def set_team(self, team: str):
        team = sanitizing_by_html(team)
        if sanitizing_str(team, 100):
            db = firestore.client()
            db.collection("projects").document(self.id).update(
                {
                    "team": team,
                }
            )
        else:
            raise

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
        description = sanitizing_by_html(description)
        if sanitizing_str(description, 100):
            db = firestore.client()
            db.collection("projects").document(self.id).set(
                {
                    "description": description,
                }
            , merge=True)
        else:
            raise

    def set_youtube(self, youtube: str):
        # YoutubeのURLか
        if re.match(r'https:\/\/youtu.be\/(\w+)', youtube) is None:
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
        old = db.collection("projects").document(self.id).get().to_dict().get("icon")
        if old is not None:
            Project.drop_img(old)
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

    # def set_img(self, img):
    #     db = firestore.client()
    #     old = db.collection("projects").document(self.id).get().to_dict().get("img")
    #     if old is not None:
    #         Project.drop_img(old)
    #     path  = os.path.join(self.id, f"img.{imghdr.what(img)}")
    #     Project.save_img(path, img)
    #     db.collection("projects").document(self.id).set(
    #         {
    #             "img": path,
    #         }
    #     , merge=True)

    # def delete_img(self):
    #     db = firestore.client()
    #     data = db.collection("projects").document(self.id).get().to_dict()
    #     if "img" in data:
    #         Project.drop_img(data["img"])
    #     db.collection("projects").document(self.id).update(
    #         {
    #             "img": firestore.DELETE_FIELD,
    #         }
    #     )

    # project_details
    def get_details(self) -> ProjectDetails:
        db = firestore.client()
        data = db.collection("projects").document(self.id).get().to_dict().get("details", {})
        details = ProjectDetails(**data)
        details.img_screenshot = [ImgScreenshot(id=img_screenshot.id, path=Project.gen_img_url(img_screenshot.path)) for img_screenshot in details.img_screenshot]
        return details

    def add_img_screenshot(self, img):
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        img_id = sha1_hash(f"{self.id}{img}{timestamp}")

        db = firestore.client()
        path  = os.path.join(self.id, "img_screenshot", f"{img_id}.{imghdr.what(img)}")
        Project.save_img(path, img)
        db.collection("projects").document(self.id).update(
            {
                f"details.img_screenshot": firestore.firestore.ArrayUnion([path])
            }
        )

    def delete_img_screenshot(self, img_id: str):
        db = firestore.client()
        img_screenshot = db.collection("projects").document(self.id).get().to_dict().get("details", {}).get("img_screenshot", [])
        img_id = int(img_id)
        if len(img_screenshot) > img_id:
            Project.drop_img(img_screenshot[img_id])
        db.collection("projects").document(self.id).update(
            {
                f"details.img_screenshot": firestore.firestore.ArrayRemove([img_screenshot[img_id]]),
            }
        )

    ## required_spec
    def add_required_spec(self, required_spec: RequiredSpecRequest):
        required_spec.item = sanitizing_by_html(required_spec.item)
        required_spec.required = sanitizing_by_html(required_spec.required)
        if all([sanitizing_str(req, 100) for req in [required_spec.item, required_spec.required]]): # all 判定
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
        else:
            raise

    def get_required_spec(self) -> list[RequiredSpec]:
        db = firestore.client()
        required_spec = db.collection("projects").document(self.id).get().to_dict().get("details", {}).get("required_spec", {})
        return [RequiredSpec(id = key, **value) for key, value in required_spec.items()]

    def delete_required_spec(self, spec_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                f"details.required_spec.{spec_id}": firestore.DELETE_FIELD,
            }
        )

    ## install
    def get_install(self) -> list[Install]:
        db = firestore.client()
        install = db.collection("projects").document(self.id).get().to_dict().get("details", {}).get("install", {})
        return [Install(id=key, **value) for key, value in install.items()]

    def add_install(self, install: Install):
        install.method = sanitizing_by_html(install.method)
        install.info = sanitizing_by_html(install.info)
        if all([sanitizing_str(ins, 100) for ins in [install.method, install.info]]): # all 判定
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
                install.additional = sanitizing_by_html(install.additional)
                if sanitizing_str(install.additional, 100):
                    db.collection("projects").document(self.id).update(
                        {
                            f"details.install.{install_id}.additional": install.additional
                        }
                    )
                else:
                    raise
        else:
            raise

    def delete_install(self, install_id: str):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                f"details.install.{install_id}": firestore.DELETE_FIELD,
            }
        )

    ## forjob
    def set_forjob(self, forjob: str):
        forjob = sanitizing_by_html(forjob)
        if sanitizing_str(forjob, 100):
            db = firestore.client()
            db.collection("projects").document(self.id).update(
                {
                    "details.forjob": forjob,
                }
            )
        else:
            raise

    def delete_forjob(self):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "details.forjob": firestore.DELETE_FIELD,
            }
        )

    # project_review
    def get_review(self) -> [ProjectReview]:
        db = firestore.client()
        review = db.collection("projects").document(self.id).get().to_dict().get("review", {})
        return [review(id=key, **value) for key, value in review.items()]

    def add_review(self, review: ProjectReviewRequest):
        review.title = sanitizing_by_html(review.title)
        review.content = sanitizing_by_html(review.content)
        master = [review.title, review.content] # if 判定用のリスト
        if all([sanitizing_str(rev, 100) for rev in master]) and sanitizing_int(review.rating, 5): # all 判定 と and
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
        else:
            raise


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
    def get_project(limit: int = 10, page: int = 1, order: Optional[str] = None, year: Optional[int] = None, team: Optional[str] = None, include: Optional[bool] = True) -> list[ProjectSummary]:
        db = firestore.client()
        snapshot = db.collection("projects")

        if year is not None:
            docs = db.collection("teams").where(filter=firestore.firestore.FieldFilter("year", "==", year)).get()
            candidate = [doc.id for doc in docs]
            if len(candidate) > 0:
                snapshot = snapshot.where(filter=firestore.firestore.FieldFilter("team", "in", candidate))
            else:
                return list()
        if team is not None:
            if Teams.is_exist(team):
                candidate = Teams(team).get_relations()
                if not include:
                    if len(candidate) > 1:
                        candidate.remove(team)
                    else:
                        return list()
                snapshot = snapshot.where(filter=firestore.firestore.FieldFilter("team", "in", candidate))
            else:
                return list()
        if order is None:
            st_doc = snapshot.limit(1 + limit * (page - 1)).get()[-1]
            snapshot = snapshot.start_at(st_doc).limit(limit)
        else:
            st_doc = snapshot.order_by(order).limit(1 + limit * (page - 1)).get()[-1]
            snapshot = snapshot.start_at(st_doc).order_by(order).limit(limit)

        def convert(data: dict):
            data["team_id"] = data["team"]
            data["team"] = Teams(data["team"]).get_name()

            if "icon" in data:
                data["icon"] = Project.gen_img_url(data["icon"])
            img_screenshot = data.get("details", {}).get("img_screenshot", [])
            if len(img_screenshot) > 0:
                data["img"] = Project.gen_img_url(img_screenshot[0])

            return data
        docs =  snapshot.select(["details.img_screenshot", *ProjectSummary.__annotations__.keys()]).get()
        return [ProjectSummary(id = doc.id, **convert(doc.to_dict())) for doc in docs]

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
            expiration=datetime.timedelta(minutes=60),
            method="GET",
        )

    @staticmethod
    def save_img(path: str, img):
        bucket = storage.bucket("mws-market.appspot.com")
        blob = bucket.blob(path)
        blob.upload_from_file(img)

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
