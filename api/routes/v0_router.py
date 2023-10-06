from fastapi import APIRouter
from routes.v0.projects import router as projects_router
from routes.v0.team import router as teams_router
from routes.v0.user import router as users_router
from routes.v0.debug import router as debug_router

def get_router():
    r = APIRouter()
    r.include_router(projects_router, prefix="/projects")
    r.include_router(teams_router, prefix="/teams", tags=["v0_teams"])
    r.include_router(users_router, prefix="/users", tags=["v0_users"])
    r.include_router(debug_router, prefix="/debug", tags=["debug"])
    return r
