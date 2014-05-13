import dg
import signal

signal.signal(signal.SIGCHLD, signal.SIG_IGN)
