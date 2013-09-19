## yoboard

### FAQ

#### What's this?

A simple CRUD in [dg](https://github.com/pyos/dg) that uses [Flask](https://github.com/mitsuhiko/flask).

#### Why's it called like that? Does it have something to do with douchebags?

![YOBA face](http://lurkmore.so/images/8/8d/1238521509967.png)

YOBoard = Y.O.B.A. | image board.
Y.O.B.A = Youth-oriented, Bydlo-approved (e.g. Call of Duty.)

#### What are the requirements?

  * [dg](https://github.com/pyos/dg) (to compile stuff.)
  * [Flask](https://github.com/mitsuhiko/flask) (to run stuff.)
  * imagemagick (to downscale uploaded stuff.)
  * a FreeDesktop icon theme with MIME type icons (to display something instead of stuff that cannot be downscaled.)

#### What should one do with imagemagick?

Install it somewhere and add it to the `PATH` environment variable.

#### OK, and the icon theme?

*(Note that since this stuff isn't used yet, following these steps is unnecessary.)*

On Linux, install it system-wide (i.e. either in `/usr/share/icons` or in `~/.local/share/icons`).
On other platforms, move it into the root directory of this project.
Then, regardless of which OS you use, put its name in `config.dg`

#### What about these Python modules?

Ahem.

#### How to start this crap?

  1. Tweak `config.dg`.
  2. Create directories pointed to by `STORAGE_DIR` and `UPLOAD_DIR`.
  3. Configure nginx to serve `/static/` from `STATIC_DIR`, `/static/upload/` from `UPLOAD_DIR`, and proxy everything else to `127.0.0.1:5000`.
  4. Run `python -m yoboard.database` in one window.
  5. Run `python -m yoboard.viewserver` in another.

Note that while the Flask dev server is OK, using load-balancing servers such as
[gunicorn](http://gunicorn.org/) is recommended. The WSGI app is at `yoboard.viewserver:app`.

#### Why doesn't it use my favorite (No)?SQL database?

Point me to just one image board that is running a distributed database.
And no, 4chan.org and 2ch.net don't count -- they're old and well-known,
while there's a very small chance something running this crap will ever
be that popular.

#### Is there a local client for that database?

`python -m yoboard.database.cli` starts a dg REPL with `d` being
a `Client` connected to the database. You can execute database
commands in it; for example,

```dg
>>> # Reply to post #12 on board "b".
>>> # The last argument contains (filename, thumbnail name) pairs
>>> # that both should point to files under /static/uploads/.
>>> d.create_post 'b' 12 sage: True 'Topic' 'Text' list!
83
>>> # That post was assigned no. 83.
```

#### No, I meant `select * from threads where amount_of_bullshit > 9000`

The database is extremely specialized, with atomic operations being
the ones made by image board clients. If you really want to go deeper,
shut the database server down and unpickle the database file.

#### What's the point?

There is none.
