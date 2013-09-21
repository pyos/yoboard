## yoboard

A simple CRUD in [dg](https://github.com/pyos/dg) that uses [Flask](https://github.com/mitsuhiko/flask).

### Why's it called like that? Does it have something to do with douchebags?

```dg
yoboard = YOBA + image board where
  YOBA = youth-oriented, bydlo-approved # e.g. Call of Duty
```

Also, [this thing](http://lurkmore.so/images/8/8d/1238521509967.png) is called a "yoba face".

### Requirements

  * [dg](https://pyos.github.io/dg) to compile stuff.
  * [Flask](http://flask.pocoo.org/) to run stuff.
  * [imagemagick](http://www.imagemagick.org/) to downscale uploaded stuff.

### Running the web server

  1. Tweak `config.dg`.
  2. Create directories pointed to by `STORAGE_DIR` and `UPLOAD_DIR`.
  3. Configure nginx to serve `/static/` from `STATIC_DIR`, `/static/upload/` from `UPLOAD_DIR`, and proxy everything else to `127.0.0.1:5000`.
  4. `python3 -m yoboard.viewserver`.

Note that while the Flask dev server is OK, using load-balancing servers such as
[gunicorn](http://gunicorn.org/) is recommended. The WSGI app is at `yoboard.viewserver:app`.

### Running the database

  1. Tweak `config.dg`.
  2. `python3 -m yoboard.database`.
  3. Optionally, `python3 -m yoboard.database.cli` to make sure it started up OK.

### Wait, what database is THAT?

It's not a database, it's a non-distributed Python object storage with
[pickle](http://docs.python.org/3.3/library/pickle.html)-based RPC interface
that also dumps all the data it has into a file at periodic intervals
and on shutdown.

### Accessing the database directly

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
