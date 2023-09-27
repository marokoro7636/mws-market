from firebase_admin import firestore
from helper.util import sha1_hash
from urllib.parse import urlparse
from urllib.request import urlopen
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
    def get_by_id(id):
        db = firestore.client()
        doc = db.collection("projects").document(id).get()
        if doc.exists:
            return ProjectInfo(**doc.to_dict())
        else:
            return None

    @staticmethod
    def is_exist(id):
        db = firestore.client()
        doc = db.collection("projects").document(id).get()
        if doc.exists:
            return True
        else:
            return False

    def set_name(self, new_name):
        db = firestore.client()
        db.collection("projects").document(self.id).update(
            {
                "name": new_name,
            }
        )

    # project_info
    @staticmethod
    def update_project_name(project_id: str, name: str):
        db = firestore.client()
        db.collection("projects").document(project_id).update(
            {
                "name": name,
            }
        )

    @staticmethod
    def update_project_description(project_id: str, description: str):
        db = firestore.client()
        db.collection("projects").document(project_id).set(
            {
                "description": description,
            }
        , merge=True)

    @staticmethod
    def update_project_youtube(project_id: str, youtube: str):
        url = urlparse(youtube)
        # YoutubeのURLか
        if url.scheme not in ["https", "http"] or url.hostname != "www.youtube.com":
            raise

        # URLが存在しているか
        try:
            res = urlopen(youtube)
            res.close()
        except:
            raise

        db = firestore.client()
        db.collection("projects").document(project_id).set(
            {
                "youtube": youtube,
            }
        , merge=True)

    @staticmethod
    def delete_project_youtube(project_id: str):
        db = firestore.client()
        data = db.collection("projects").document(project_id).get().to_dict()
        if "youtube" in data:
            db.collection("projects").document(project_id).update(
                {
                    "youtube": firestore.DELETE_FIELD ,
                }
            )

    @staticmethod
    def update_project_index(project_id: str, is_hidden: bool):
        db = firestore.client()
        db.collection("projects").document(project_id).set(
            {
                "isIndex": not is_hidden,
            }
        , merge=True)

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
