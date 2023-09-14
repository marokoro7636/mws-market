from pydantic import BaseModel
from fastapi import APIRouter
from typing import Optional

router = APIRouter()


class Log(BaseModel):
    project_id: Optional[str]


@router.post("/{project_id}")
def register_project(project_id: Log):
    # safe_id = check_id(project_id)
    # try:
    #      db_store(safe_id)
    # except:
    #      return {"error":"inappropriate project_id"}
    # return {"project_id":safe_id}
    return {"project_id": project_id}

#@router.get("/{project_id}")
#def get_project_info(project_id: Log):
    # safe_id = check_id(project_id)
    # try:
    #      info_list = get_info(project_id)
    # except:
    #      return {"error":"inappropriate project_id"}
    # return {"project_info":info_list}
    #return {"name": f"project{project_id}"}
