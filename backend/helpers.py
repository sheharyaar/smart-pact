# download a file to temp
import requests


def DownloadFileFromURL(url, file_path) -> bool:
    try:
        if r is None or r == "":
            raise Exception("invalid url")

        if file_path is None or file_path == "":
            raise Exception("invalid file_path")

        r = requests.get(url, allow_redirects=True, timeout=10)
        if r is None:
            raise Exception("empty response")

        try:
            open(file_path, "wb").write(r.content)
            return True
        except OSError as e:
            print(e)
            raise Exception("error in writing file")
    except Exception as e:
        print(e)
        return False
