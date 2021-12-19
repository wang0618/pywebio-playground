import base64
import sys
import traceback
from urllib.parse import urlparse

from pywebio import start_server
from pywebio.output import popup, put_error, PopupSize
from pywebio.session import local as session_local, eval_js, run_js

referrer_host_white_list = ('localhost', 'play.pywebio.online')
play_ground_url = 'https://play.pywebio.online/#'



def on_task_exception():
    type, value, tb = sys.exc_info()
    tb_len = len(list(traceback.walk_tb(tb)))
    lines = traceback.format_exception(type, value, tb, limit=1 - tb_len)
    traceback_text = ''.join(lines)

    traceback_text = traceback_text.replace('File "<string>", l', 'L')

    try:
        popup(title="An internal error occurred in the application",
              content=put_error(traceback_text), size=PopupSize.LARGE)
    except Exception:
        pass


def main():
    session_local.globals = dict()
    b64code = eval_js("new URLSearchParams(window.location.search).get('code')") or ''
    code = base64.b64decode(b64code)

    referrer = urlparse(eval_js("document.referrer"))

    if referrer.hostname not in referrer_host_white_list:
        return run_js('location.href=url', url=play_ground_url + b64code)

    if not code:
        return

    try:
        exec(code, {})
    except Exception:
        on_task_exception()


if __name__ == '__main__':
    import os

    port = int(os.environ.get('PORT', 8080))
    start_server(main, debug=True, port=port)
