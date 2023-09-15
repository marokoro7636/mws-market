from fastapi import APIRouter
from routes.v0.projects import router as projects_router
from routes.mock.team import router as teams_router

def get_router():
    r = APIRouter()
    r.include_router(projects_router, prefix="/projects", tags=["v0_projects"])
    # r.include_router(teams_router, prefix="/teams", tags=["v0_teams"])
    return r
