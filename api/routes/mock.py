from fastapi import APIRouter
from routes.mock_hw import router as hw_router
from routes.projects import router as pj_router


def get_router():
    r = APIRouter()
    r.include_router(hw_router, prefix="/hw", tags=["mock_hw"])
    r.include_router(pj_router, prefix="/pj", tags=["projects"])
    return r
