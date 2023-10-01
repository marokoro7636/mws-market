from fastapi import APIRouter
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Optional
from fastapi import Header

from helper.auth import isAuthed
from helper.response import API_OK
from models.requests import (
    User,
    UserRequest,
)
from models.users import Users


router = APIRouter()

@router.get("/{user_id}", response_model=User)
def get_user(user_id: str, x_auth_token: Optional[str] = Header(None)):
    if not Users.is_exist(user_id):
        raise StarletteHTTPException(status_code=404, detail="User not found")
    if not isAuthed([user_id], x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")

    try:
        data = Users(user_id).get()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get Users")
    return User(**data)

@router.post("/{user_id}", response_model=API_OK)
def post_user(user_id: str, req: UserRequest, x_auth_token: Optional[str] = Header(None)):
    if not isAuthed([user_id], x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    try:
        Users.create(req)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post user")
    return API_OK()

@router.post("/{user_id}/name", response_model=API_OK)
def post_user_name(user_id: str, name: str, x_auth_token: Optional[str] = Header(None)):
    if not Users.is_exist(user_id):
        raise StarletteHTTPException(status_code=404, detail="User not found")
    if not isAuthed([user_id], x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")

    try:
        Users(user_id).set_name(name)
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to post user name")
    return API_OK()