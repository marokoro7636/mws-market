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
        
def sanitizing_id(id: str) -> bool:
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
    
    