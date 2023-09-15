# TODO:delete

from pydantic import BaseModel
from fastapi import APIRouter
from models.requests import Log

router = APIRouter()


@router.post("/test")
def post_text(text: Log):
    # safe_text = sanitize(text)
    # try:
    #      db_store(safe_text)
    # except:
    #      return {"error":"failed to write"}
    # return {"text":safe_text}
    return {"text": text}

@router.get("/projects/{project-id}/name")
def get_name():
    # try:
    #      name = db(project_id, "name", "get")
    # except:
    #      return {"error":"failed to get"}
    # return {"name":name}
    pass


@router.post("/projects/{project-id}/name")
def update_name(name: Log):
    # safe_name = sanitize(name)
    # try:
    #      db(project_id, "name", "update", safe_name)
    # except:
    #      return {"error":"failed to update"}
    # return {"success": f"update to {safe_name}"}
    pass
