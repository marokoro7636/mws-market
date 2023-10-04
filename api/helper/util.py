import hashlib
import secrets
import string
from langchain.document_loaders import YoutubeLoader
from langchain.chat_models import ChatOpenAI
from langchain.chains.summarize import load_summarize_chain

def sha1_hash(data):
    return hashlib.sha1(data.encode('utf-8')).hexdigest()

def make_secret(length: int):
    pass_chars = string.ascii_letters + string.digits
    secret = ''.join(secrets.choice(pass_chars) for x in range(length))
    return secret

def make_description(url: str):
    loader = YoutubeLoader.from_youtube_url(url, language=["ja"])
    documents = loader.load()
    chat = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    summarize = load_summarize_chain(chat, chain_type="stuff", verbose=True)
    result = summarize.run(documents)
    return result