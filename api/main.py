from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
import routes.mock as mock
from helper.check import check_env
from helper.init import init_firebase
import os
from dotenv import load_dotenv

if not os.environ.get("DOT_ENV") is None:
    load_dotenv(os.environ.get("DOT_ENV"))
else:
    load_dotenv()

check_env(
    [
        "CRED_PATH",
    ]
)

app = FastAPI()

# CORS, とりあえず全て許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_firebase()

# static file routing
# app.mount("/", StaticFiles(directory="./public", html=True), name="public")

app.include_router(mock.get_router(), prefix="/api/mock", tags=["api_mock"])
