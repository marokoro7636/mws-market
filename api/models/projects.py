from firebase_admin import firestore
from helper.util import sha1_hash

from models.requests import ProjectInfo

class Project():
    def __init__(self, id):
        self.id = id
    
    @staticmethod
    def create(team, name):
        # IDは適切に生成する，timestamp + team + name とか
        id = sha1_hash(team + name)
        db = firestore.client()
        db.collection('projects').document(id).set({
            'team': team,
            'name': name,
        })
        return Project(id=id)
    
    @staticmethod
    def get_by_id(id):
        pass

    @staticmethod
    def is_exist(id):
        pass
    
    def set_name(self, new_name):
        db = firestore.client()
        db.collection('projects').document(self.id).update({
            'name': new_name,
        })
