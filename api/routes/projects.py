# TODO:delete

from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional

router = APIRouter()


class Log(BaseModel):
    text: Optional[str]
    
class Register(BaseModel):
    _id : int | None

@router.get("/{_id}")
def get_info(_id: int):
    # try:
    #      info = db_get(_id)
    # except:
    #      return {"error":"Invalid _id"}
    # return info
    return {"name": f"project_{_id}", "project_id":f"{_id}"}

@router.post("/{_id}")
def register_project(_id: int):
    # if exist(_id):
    #   return {"error":"project_id {_id} Exist "}
    # try:
    #      db_store(_id)
    # except:
    #      return {"error":"Invalid project_id"}
    # return {"project_id:{_id}"}
    return {"project_id":f"{_id}"}

@router.put("/{_id}")
def update_project(_id: int):
    # if not exist(_id):
    #   return {"error":"project_id {_id} not Exist "}
    # try:
    #      db_update(_id)
    # except:
    #      return {"error":"Cannot update"}
    # return {"project_id:{_id}"}
    return {"project_id":f"{_id}"}

@router.delete("/{_id}")
def delete_project(_id: int):
    # if not exist(_id):
    #   return {"error":"project_id {_id} not Exist "}
    # try:
    #      db_delete(_id)
    # except:
    #      return {"error":"Cannot delete"}
    # return {"project_id:{_id}"}
    return {"project_id":f"{_id}"}