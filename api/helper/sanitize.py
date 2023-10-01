


def sanitizing(message: str):
    # 辞書対応でreplace
    #key = {
    #    "&": "&amp;",
    #    "<": "&lt;",
    #    ">": "&gt;",
    #    "'": "&apos;",
    #    '"': '&quot;',
    #    "/": "&;",
    #    "\\": "&;"
    #}
    
    #for bef, aft in key.items():
    #    message.replace(bef, aft)

    # 記号ではじく
    key = ["&", "<", ">", "'", '"', "/", "\\" ]
    
    # 文字数制限

    # IDが sha1であることの検証

    # ファイルサイズ

    if message in key:
        return False
    else:
        return True