## yoboard

```dg
yoboard = yoba & imageboard where
   yoba = Either
     "youth-oriented, bydlo-approved" # e.g. Call of Duty
     "http://lurkmore.so/images/8/8d/1238521509967.png"
```

### Usage

```sh
pip install -r yoboard/requirements.txt`
$EDITOR yoboard/config.dg`
python -m dg <<< 'import "/os", import "/yoboard/config", os.makedirs config.STORAGE_DIR 0o755 True, os.makedirs config.UPLOAD_DIR 0o755 True'`
python -m yoboard.database &`
gunicorn yoboard.viewserver:app`
```

#### Wait, what database is THAT?

It's not a database, it's a non-distributed Python object storage with
[pickle](http://docs.python.org/3.3/library/pickle.html)-based RPC interface
that also dumps all the data it has into a file at periodic intervals
and on shutdown.

#### Accessing the database directly

```dg
$ python -m yoboard.database.cli
>>> d.board_create 'b' 'Random' 'Adult'
>>> d.board_create 'g' 'Technology' 'Thematic'
>>> d.thread_create 'b' 'First thread' 'This is the message.' $ list' ('1.png', '1.thumb.png', 'image/png')
1
```

etc. See `/database/boardcmds.dg` for a list of commands.

### What's the point in all of this?

There is none.
