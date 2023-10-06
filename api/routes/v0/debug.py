from firebase_admin import firestore
from fastapi import APIRouter

router = APIRouter()

def isStringArray(arr):
    if not isinstance(arr, list):
        return False
    for i in arr:
        if not isinstance(i, str):
            return False
    return True

def updateTeamMembers():
    db = firestore.client()
    teams = db.collection("teams").get()
    for t in teams:
        team = t.to_dict()
        print(team)
        if not isStringArray(team["members"]):
            continue
        members = []
        for user_id in team["members"]:
            user = db.collection("users").document(user_id).get()
            if not user.exists:
                members.append({
                    "id": user_id,
                    "name": "DELETED",
                    "image": "https://placehold.jp/787878/ffffff/150x150.png?text=DEL"
                })
                continue
            user = user.to_dict()
            members.append({
                "id": user_id,
                "name": user["name"],
                "image": user["image"]
            })
        db.collection("teams").document(t.id).update(
            {
                "members": members
            }
        )
    
@router.get("/")
def debug():
    print("OK")
    updateTeamMembers()
    return {"status": "OK"}