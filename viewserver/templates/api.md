```python
>>> get("/", headers={"Accept": "application/json"})

{
  "boards": {str: {str: str}},  # {category: {id: title}}
  "config": {
    "SITE_NAME":  str,  # "{{ config.SITE_NAME }}"
    "SITE_TITLE": str,  # "{{ config.SITE_TITLE }}"
    # See `POST /board/` for information on what these mean.
    "POSTS_UNTIL_AUTOSAGE": int,   # {{ config.POSTS_UNTIL_AUTOSAGE }}
    "POSTS_PER_THREAD":     int,   # {{ config.POSTS_PER_THREAD }}
    "MAX_TITLE_LENGTH":     int,   # {{ config.MAX_TITLE_LENGTH }}
    "MAX_TEXT_LENGTH":      int,   # {{ config.MAX_TEXT_LENGTH }}
    "MAX_TEXT_LINES":       int,   # {{ config.MAX_TEXT_LINES }}
    "MAX_UPLOADS":          int,   # {{ config.MAX_UPLOADS }}
    "NOT_EMPTY":            bool,  # {{ config.NOT_EMPTY }}
    "IMAGES_ALWAYS_BUMP":   bool,  # {{ config.IMAGES_ALWAYS_BUMP }}
  }
}

>>> # Assuming you want the contents of a board with ID "b":
... get("/b/", headers={"Accept": "application/json"}) or \
... get("/b/page/0/", headers={"Accept": "application/json"})

{
  "pages": int,  # Total no. of non-empty pages on that board
  "title": str,  # Human-readable name of this board
  "threads": [thread],  # See below
}

>>> # Fetch a thread with it "1" on a board with ID "b":
... get("/b/1/", headers={"Accept": "application/json"})

{
  # Whether this thread is fixed at the top of the first page.
  # NOTE: the API sorts threads automatically.
  "attached": bool,
  # Whether this thread cannot be replied to under any circumstances.
  "closed": bool,
  # A list of some of the latest posts, ordered by ID.
  # The maximum length of this list is server-dependent.
  "latest": [post],
  # The OP of this thread.
  "root": post,
  # A tree of posts that were added as replies to this thread.
  # When fetching a board, this field is set to `null` to conserve traffic.
  "replies": [
    {
      "root":    post,
      "replies": [...],
    }
  ],
  # The number of posts in `replies` minus the number of posts in `latest`.
  "skipped": int,
}

struct post = {
  # A list of `(full-size image, thumbnail)` pairs.
  # Each value is a path relative to `/static/upload/`.
  "files": [(str, str)],
  # ID of this post. Guaranteed to be board-unique.
  "id": int,
  # ID of the post tho which this one is a reply.
  # Guaranteed to be from the same thread. 0 if this is an OP of the thread.
  "parent": int,
  # Whether the author of this post expressed displeasure with the discussion.
  # Always `false` if `parent` is 0.
  "sage": bool,
  # A pre-rendered (in HTML) message.
  "text": str,
  # ID of the OP of the thread this post is in.
  "thread": int,
  # A date and time in `%a, %d %b %Y %H:%M:%S GMT` format.
  "timestamp": str,
  # A short summary of this post, in non-escaped plaintext.
  "title": str,
}

>>> # To create a new thread/reply on a board with ID "b":
... post("/b/", data={
...   # The post to reply to. If not set, assumed to be 0, which means "new thread".
...   # If not 0 and the thread already has `POSTS_PER_THREAD` replies,
...   # this request will be refused with HTTP 403.
...   "parent": int,
...   # Whether to add some hate to this reply. Replies with this field set
...   # do not bump threads. Set to `true` automatically once the thread
...   # exceeds `POSTS_UNTIL_AUTOSAGE` replies.
...   "sage": bool,
...   # A short (up to `MAX_TITLE_LENGTH` chars) one-line description of a topic.
...   "title": str,
...   # A longer (up to `MAX_TEXT_LENGTH` chars and `MAX_TEXT_LINES` line breaks)
...   # message to start a discussion with. If `NOT_EMPTY` is `true` and there are
...   # no attachments, must not be empty.
...   "text": str,
...   # A multi-field (up to `MAX_UPLOAD` values) with attachments, all of which
...   # must be images. If `NOT_EMPTY` is `true` and `text` is empty, must contain
...   # at least one file.
...   "file": [file],
... })

Either(
  HTTP(302),  # A redirect to `/b/1/` where `1` is the thread this post was added to.
  HTTP(400),  # One of the conditions imposed on the data was not met.
  HTTP(403),  # The thread is closed or over capacity.
)
```
