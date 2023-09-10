from fastapi import APIRouter
from routes.mock_hw import router as hw_router

def get_router():
    r = APIRouter()
    r.include_router(hw_router, prefix="/hw", tags=["mock_hw"])
    return r
