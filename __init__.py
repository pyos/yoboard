import os
import dg
import signal

from . import config

if not os.path.isdir(config.UPLOAD_DIR):
    os.makedirs(config.UPLOAD_DIR, 0o755)
signal.signal(signal.SIGCHLD, signal.SIG_IGN)
