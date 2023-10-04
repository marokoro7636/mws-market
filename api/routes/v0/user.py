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
    if not isAuthed([user_id], x_auth_token):
        raise StarletteHTTPException(status_code=401, detail="Unauthorized")
    if not Users.is_exist(user_id):
        raise StarletteHTTPException(status_code=404, detail="User not found")

    try:
        data = Users(user_id).get()
    except:
        raise StarletteHTTPException(status_code=500, detail="Failed to get Users")
    return User(**data)