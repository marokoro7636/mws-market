from fastapi import APIRouter
from routes.mock.projects import router as projects_router
from routes.mock.team import router as teams_router

def get_router():
    r = APIRouter()
    r.include_router(projects_router, prefix="/projects", tags=["mock_projects"])
    r.include_router(teams_router, prefix="/teams", tags=["mock_teams"])
    return r
