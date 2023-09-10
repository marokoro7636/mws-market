import os
from firebase_admin import credentials, initialize_app

def init_firebase():
    cred = credentials.Certificate(os.environ.get("CRED_PATH"))
    initialize_app(cred)