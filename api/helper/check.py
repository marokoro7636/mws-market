import os
from fastapi import UploadFile
import imghdr

# 許可する画像の種類
# 参考: https://docs.python.org/ja/3/library/imghdr.html
ALLOW_IMAGE_FORMAT = ["png", "jpeg", "bmp"]

# 許可する画像の最大サイズ(byte)
ALLOW_IMAGE_SIZE = 2 * 1024 * 1024


def check_env(required):
    """
    Check if all required environment variables are set
    """
    for env in required:
        if not os.environ.get(env):
            raise EnvironmentError(f"Environment variable {env} is not set")

def check_img(img: UploadFile):
    img_format = imghdr.what(img.file)
    img.file.seek(0, 2)
    img_size = img.file.tell()
    img.file.seek(0, os.SEEK_SET)
    if img_format in ALLOW_IMAGE_FORMAT and img_size <= ALLOW_IMAGE_SIZE:
        return True
    else:
        return False