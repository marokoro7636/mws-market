# Firebase AuthのidTokenから認証に関する情報を取得する
from firebase_admin import auth
from typing import Optional
from models.teams import Teams

class AuthedUser:
    id: str
    name: str
    role: str
    pass

def isAuthed(team_id: str, idToken: Optional[str]):
    if idToken is None:
        return True
        # return False
    try:
        decoded_token = auth.verify_id_token(idToken)
        user_id = decoded_token['user_id']
        if Teams(team_id).is_member(user_id):
            return True
        else:
            return False
    except:
        return False

def getAuthedUser(idToken: str):
    return AuthedUser()