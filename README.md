## yoboard

```dg
yoboard = yoba & imageboard where
   yoba = Either
     "youth-oriented, bydlo-approved" # e.g. Call of Duty
     "http://lurkmore.so/images/8/8d/1238521509967.png"
```

### Usage

```sh
pip install -r yoboard/requirements.txt
# Tweak the configuration.
$EDITOR yoboard/config.dg
# Initialize an empty database.
python -m yoboard.database &
# Create an admin user.
python -m yoboard.database.cli <<< 'd.user_set "YOUR_ADMIN_PASSWORD" True'
# Start the server.
python -m yoboard.viewserver  # or `some_wsgi_server yoboard.viewserver:app`
```

#### Accessing the database directly

```dg
$ python -m yoboard.database.cli
>>> d.board_create 'b' 'Random' 'Adult'
>>> d.board_create 'g' 'Technology' 'Thematic'
>>> d.thread_create 'b' 'First thread' 'This is the message.' (list' ('1.png', '1.thumb.png', 'image/png')) '127.0.0.1'
1
```

etc. See `/database/boardcmds.dg` for a list of commands.
