# Firebase AuthのidTokenから認証に関する情報を取得する
from firebase_admin import auth
from typing import Optional
class AuthedUser:
    id: str
    name: str
    role: str
    pass

def isAuthed(idToken: Optional[str]):
    if idToken is None:
        return True
        # return False
    try:
        decoded_token = auth.verify_id_token(idToken)
        uid = decoded_token['uid']
        return True
    except:
        return False

def getAuthedUser(idToken: str):
    return AuthedUser()