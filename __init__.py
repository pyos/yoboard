import dg
import os
import signal
from . import config

signal.signal(signal.SIGCHLD, signal.SIG_IGN)
os.path.exists(config.STORAGE_DIR) or os.makedirs(config.STORAGE_DIR, 0o755, True)
os.path.exists(config.UPLOAD_DIR)  or os.makedirs(config.UPLOAD_DIR,  0o755, True)
os.path.exists(config.BANNER_DIR)  or os.makedirs(config.BANNER_DIR,  0o755, True)
