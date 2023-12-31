import re
import html


def sanitizing_by_html(text: str) -> str:
    # 記号をエスケープ( "&", "<", ">", "'", '"' )
    return html.escape(text)

def sanitizing_str(text: str, size: int) -> bool:
    # 文字数制限
    # 半角英数字か判定（正規表現）
    alnum = re.compile(r"^[a-zA-Z0-9]+$")
    if alnum.match(text):
        if len(text) <= size:
            return True
        else:
            return False
    else:
        if len(text) <= 2*size:
            return True
        else:
            return False
        
def sanitizing_sha1(id: str) -> bool:
    # IDが sha1 であることの検証
    sha1 = re.compile(r"^[a-fA-F0-9]{40}$")
    if sha1.match(id):
        return True
    else:
        return False
    
def sanitizing_int(num: int, size: int) -> bool:
    # 文字数制限(int)
    num = str(num)
    if len(num) <= size:
        return True
    else:
        return False
    
def sanitizing_user_id(id: str) -> bool:
    # user_id が想定通りの形式かの検証
    user = re.compile(r"^[a-zA-Z0-9]{20}$") # 自動生成
    ano = re.compile(r"^(ANONIMOUS-)[a-fA-F0-9]{40}$") # ANONIMOUS 形式
    if user.match(id) or ano.match(id):
        return True
    else:
        return False

    