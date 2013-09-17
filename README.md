## yoboard

### FAQ

#### What's this?

A simple CRUD in [dg](https://github.com/pyos/dg) that uses [Flask](https://github.com/mitsuhiko/flask).

#### What are the requirements?

  * [dg](https://github.com/pyos/dg) (to compile stuff.)
  * [Flask](https://github.com/mitsuhiko/flask) (to run stuff.)
  * [bluelet](https://github.com/sampsyo/bluelet) (to send stuff between the app and the database.)
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

`python -m yoboard.database` in one terminal window, `python -m yoboard` in another one.

#### Why doesn't it use my favorite (No)?SQL database?

Point me to just one image board that is running a distributed database.
And no, 4chan.org and 2ch.net don't count -- they're old and well-known,
while there's a very small chance something running this crap will ever
be that popular.

#### What's the point?

There is none.
