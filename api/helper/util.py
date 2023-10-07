import hashlib
import secrets
import string
from langchain.document_loaders import YoutubeLoader
from langchain.chains.summarize import load_summarize_chain
from langchain.chat_models import ChatOpenAI
from langchain.llms import OpenAI
from langchain.chains import SimpleSequentialChain
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
import re
import json
import base64
from  urllib.parse import unquote, urlparse
import urllib.request
from typing import Optional

def sha1_hash(data):
    return hashlib.sha1(data.encode('utf-8')).hexdigest()

def make_secret(length: int):
    pass_chars = string.ascii_letters + string.digits
    secret = ''.join(secrets.choice(pass_chars) for x in range(length))
    return secret

def make_description(youtube: Optional[str] = None, github: Optional[str] = None, description: Optional[str] = None):
    youtube = get_script(youtube)
    github = get_readme(github)
    if description is not None:
        description = Document(page_content=description)

    chat = ChatOpenAI(temperature=0)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)

    prompt= PromptTemplate(
    		input_variables=["text"],
    		template="""以下の文はあるツールの紹介文の要約です。このツールを日本語で400文字で説明してください。:

            "{text}"

            """
    )

    documents = [youtube, github, description]
    source = {medium: "ok" if document is not None  else "ng" for medium, document in zip(["youtube", "github", "description"], documents)}
    documents = [x for x in documents if x is not None]

    summarize = load_summarize_chain(llm=chat, chain_type="map_reduce", verbose=False)
    text = summarize.run(text_splitter.split_documents(documents))

    chain = LLMChain(llm=chat, prompt=prompt)

    result = chain.run(text = text)
    return result, source

def get_script(url: str):
    if url is None or re.match(r'^https?:\/\/(www.youtube.com\/|youtu.be\/)(\w+)', url) is None:
        return None
    parse = urlparse(url)
    if re.match(r'^https?:\/\/www.youtube.com\/(\w+)', url) is not None:
        id = urllib.parse.parse_qs(parse.query).get("v")[0]
    if re.match(r'^https?:\/\/youtu.be\/(\w+)', url) is not None:
        id = parse.path.split('/')[1]

    url = f"https://youtu.be/{id}"
    try:
        loader = YoutubeLoader.from_youtube_url(url, language=["ja"])
        documents = loader.load()
    except:
        return None
    return documents[0]

def get_readme(url: str):
    if url is None or re.match(r'https:\/\/github.com\/(\w+)', url) is None:
        return None
    parse = urlparse(url).path.split('/')
    owner = parse[1]
    repos = parse[2]
    url = f"https://api.github.com/repos/{owner}/{repos}/readme"
    headers = {"Accept": "application/vnd.github+json"}
    request = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(request) as res:
            response = json.load(res)
    except urllib.error.HTTPError:
        return None

    text = base64.b64decode(response.get("content")).decode()
    return Document(page_content=text[:min(len(text) // 5, 1000)])