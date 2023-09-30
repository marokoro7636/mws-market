# Firebase AuthのidTokenから認証に関する情報を取得する

class AuthedUser:
    id: str
    name: str
    role: str
    pass

def isAuthed(idToken: str):
    return False

def getAuthedUser(idToken: str):
    return AuthedUser()