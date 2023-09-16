from firebase_admin import firestore
from helper.util import sha1_hash

from models.requests import ProjectInfo, ProjectRequest

class Project():
    def __init__(self, id):
        self.id = id

    @staticmethod
    def create(team, name):
        # IDは適切に生成する，timestamp + team + name とか
        id = sha1_hash(team + name)
        db = firestore.client()
        db.collection('projects').document(id).set({
            'id' : id,
            'team': team,
            'name': name,
        })
        return Project(id=id)

    @staticmethod
    def get_by_id(id):
        pass

    @staticmethod
    def is_exist(id):
        db = firestore.client()
        docs = db.collection('projects').document(id).get()
        if docs.exists:
            return True
        else:
            return False

    def set_name(self, new_name):
        db = firestore.client()
        db.collection('projects').document(self.id).update({
            'name': new_name,
        })

    # required_specに関して記述していく
    ## add function
    @staticmethod
    def add_project_required_spec(project_id, required_spec):
        db = firestore.client()
        db.collection('projects').document(project_id).set


    ## get function
    @staticmethod
    def get_project_required_specs(project_id):
        return

    ## delete function
    @staticmethod
    def delete_project_required_spec(project_id, required_spec_id):
        return








    # get_projectsの実装 by Yamamoto
    ## Projectのドキュメントを全てリストに集める
    ## 要求データは存在すると仮定
    @staticmethod
    def get_projects():
        db = firestore.client()
        docs = db.collection('project').stream()
