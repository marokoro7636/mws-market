import hashlib
import secrets
import string

def sha1_hash(data):
    return hashlib.sha1(data.encode('utf-8')).hexdigest()

def make_secret(length: int):
    pass_chars = string.ascii_letters + string.digits
    secret = ''.join(secrets.choice(pass_chars) for x in range(length))
    return secret