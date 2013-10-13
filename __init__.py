import dg
import os
import signal
from . import config

signal.signal(signal.SIGCHLD, signal.SIG_IGN)
os.makedirs(config.STORAGE_DIR, 0o755, True)
os.makedirs(config.UPLOAD_DIR,  0o755, True)
os.makedirs(config.BANNER_DIR,  0o755, True)
