import re


def sanitizing_by_str(text: str):
    # 記号をはじく
    key = ["&", "<", ">", "'", '"', "/", "\\" ] # 要検証（"+", "*"）なども?
    if text in key:
        return False
    else:
        return True

def sanitizing_by_len(text: str):
    # 文字数制限
    # 半角英数字か判定（正規表現）
    alnum = re.compile(r"^(\w)+$")
    if alnum.match(text): ## or　if text.encode("utf-8").isalnum():
        if len(text) < 30: # 調節想定
            return True
        else:
            return False
    else:
        if len(text) < 60:
            return True
        else:
            return False
        
def sanitizing_by_id(id: str):
    # IDが sha1 であることの検証
    sha1 = re.compile(r"^[a-f0-9]{40}$")
    if sha1.match(id):
        return True
    else:
        return False

def sanitizing_by_file(filename: str):
    # ファイル形式：jpg or ping + サイズ
    # format = re.compile(r"jpeg$") 末尾に限定すべきか
    if filename in ["jpeg", "png"]: # and (size < 500x500) 不明
        return True
    else:
        return False
    