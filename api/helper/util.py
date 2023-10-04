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

def sha1_hash(data):
    return hashlib.sha1(data.encode('utf-8')).hexdigest()

def make_secret(length: int):
    pass_chars = string.ascii_letters + string.digits
    secret = ''.join(secrets.choice(pass_chars) for x in range(length))
    return secret

def make_description(url: str, length):
    chat = ChatOpenAI(temperature=0)
    loader = YoutubeLoader.from_youtube_url(url, language=["ja"])
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)

    prompt= PromptTemplate(
    		input_variables=["text", "length"],
    		template="""以下の文はツールの紹介文です。このツールを{length}文字で説明してください。:

            "{text}"

            """
    )
    chain = LLMChain(llm=chat, prompt=prompt)
    result = chain.run(text = text_splitter.split_documents(documents), length=length)

    return result