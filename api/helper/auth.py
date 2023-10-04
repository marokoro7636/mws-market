# Firebase AuthのidTokenから認証に関する情報を取得する
from firebase_admin import auth
from typing import Optional
from firebase_admin import firestore

class AuthedUser:
    id: str
    name: str
    role: str
    pass

def isAuthed(members: list[str], idToken: Optional[str]):
    if idToken is None:
        return True
        # return False
    try:
        db = firestore.client()
        doc = db.collection("session2uid").document(idToken).get()
        if doc.exists and doc.get("uid") in members:
            return True
        else:
            return False
    except:
        return False

def getAuthedUser(idToken: str):
    return AuthedUser()