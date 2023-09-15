from fastapi import APIRouter
from routes.mock.projects import router as mock_projects_router

def get_router():
    r = APIRouter()
    r.include_router(mock_projects_router, prefix="/projects", tags=["mock_projects"])
    r.include_router(mock_projects_router, prefix="/teams", tags=["mock_teams"])
    return r
