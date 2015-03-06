## yoboard

```dg
yoboard = yoba & imageboard where
   yoba = Either
     "youth-oriented, bydlo-approved" # e.g. Call of Duty
     "http://lurkmore.so/images/8/8d/1238521509967.png"
```

### Requirements

  * Python 3.4+ w/ pip
  * Everything in `requirements.txt`
  * imagemagick (to allow image uploads; set `FILES_*` to empty lists to disable)
  * ffmpeg (to allow video uploads; set `FILES_VIDEO` to an empty list to disable)

### Usage

```sh
pip install -r yoboard/requirements.txt
# Tweak the configuration.
$EDITOR yoboard/config.dg
# Start the database.
python -m yoboard.database &
# Create an admin user.
python -m yoboard.database.cli <<< 'd.user_set "YOUR_ADMIN_PASSWORD" True'
# Start the HTTP server.
python -m yoboard.viewserver  #=> http://127.0.0.1:8000/
# or `gunicorn -k dogeweb.gunicorn.Worker yoboard.viewserver:app`
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
