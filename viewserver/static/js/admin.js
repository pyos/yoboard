"use strict";

var Admin = {
  really: false,
  prompt: "A TI KTO?",
  e403:   "Ты не админишь эту борду, пес!",
  e403g:  "У тебя слишком низкий уровень чтобы менять список борд.",
  e404:   "Обнови страницу, а то на древнюю копию смотришь как сыч.",

  enable: function (uid) {
    $.cookie("userid", uid, { "expires": 365, "path": "/" });
    $("#admin-mode").text("Admin mode: ...");
    $.ajax("/_ismod/", {
      dataType:   'json',
      statusCode: {
        403: Admin.disable,
        200: function (data) {
          Admin.really = data;
          $("#admin-mode").text("Admin mode: on").off('click').click(Admin.disable);

          var board = location.pathname.split("/")[1];
          if (data === true || data.indexOf(board) >= 0) {
            $(".post").each(Admin.Posts.entry);
            $(".board-index li").each(Admin.Boards.entry);
            $("body > .post-view-tree > .post:first-child").each(Admin.Threads.entry);
            // TODO add an UI for board creation.
          }
        }
      }
    });
  },

  disable: function () {
    Admin.really = false;
    $.removeCookie("userid", { "path": "/" });
    $(".admin").remove();
    $("#admin-mode").text("Admin mode: off").off('click').click(function () {
      bootbox.prompt(Admin.prompt, function (val) {
        if (val !== null) Admin.enable(val);
      });
    });
  },

  Boards: {
    entry: function () {
      var board = this;
      $("<a />").addClass("admin")
                .addClass("admin-board-rm")
                .addClass("glyphicon")
                .addClass("glyphicon-remove-circle")
                .attr("title", "Удалить")
                .css("padding-right", "5px")
                .click(function () { Admin.Boards.del(board); })
                .prependTo(this);
    },

    add: function (board, title, category) {
      // TODO add an item.
      $.ajax("/" + board + "/", {
        method:     "PUT",
        data:       { title: title, cat: category },
        statusCode: {
          200: function () { },
          403: function () { bootbox.alert(Admin.e403g); }
        }
      });
    },

    del: function (board) {
      // TODO do something with empty categories
      var name = $(board).children("a[href]").attr("href");
      $.ajax(name, {
        method:     "DELETE",
        statusCode: {
          200: function () { $(board).remove() },
          403: function () { bootbox.alert(Admin.e403g); },
          404: function () { bootbox.alert(Admin.e404);  }
        }
      });
    }
  },

  Threads: {
    entry: function () {
      Admin.Posts.button(this, 'tree-close',  'Закрыть',    'stop',       Admin.Threads.close);
      Admin.Posts.button(this, 'tree-open',   'Открыть',    'play',       Admin.Threads.open);
      Admin.Posts.button(this, 'tree-attach', 'Прикрепить', 'arrow-up',   Admin.Threads.attach);
      Admin.Posts.button(this, 'tree-detach', 'Открепить',  'arrow-down', Admin.Threads.detach);
    },

    setState: function (thread, state, cls, enabled) {
      var url = $(thread).find(".post-id").attr("href").split("#")[0];
      $.ajax(url + state, {
        method:     enabled ? "PUT" : "DELETE",
        statusCode: {
          200: function () { $(thread).parents(".post-view-tree").find(".post").toggleClass(cls); },
          403: function () { bootbox.alert(Admin.e403); },
          404: function () { bootbox.alert(Admin.e404); }
        }
      });
    },

    close:  function (thread) { Admin.Threads.setState(thread, "close",  "post-closed",   true);  },
    open:   function (thread) { Admin.Threads.setState(thread, "close",  "post-closed",   false); },
    attach: function (thread) { Admin.Threads.setState(thread, "attach", "post-attached", true);  },
    detach: function (thread) { Admin.Threads.setState(thread, "attach", "post-attached", false); }
  },

  Posts: {
    entry: function () {
      Admin.Posts.button(this, 'tree-rm', 'Удалить', 'remove', Admin.Posts.del);
    },

    button: function (post, cls, title, icon, fn) {
      return $("<a />").addClass("admin")
                       .addClass("admin-" + cls)
                       .addClass("glyphicon")
                       .addClass("glyphicon-" + icon)
                       .attr("title", title)
                       .click(function () { fn(post); })
                       .appendTo($(post).find(".media-heading"));
    },

    del: function (post) {
      // TODO if this is a thread or we're using a tree view, remove the whole tree.
      //      If we're on its page, do something else.
      var board = $(post).find(".post-id").attr("href").split("/")[1];
      var pid   = $(post).attr("id");
      $.ajax("/" + board + "/" + pid + "/", {
        method:     "DELETE",
        statusCode: {
          200: function () { $(post).remove(); },
          403: function () { bootbox.alert(Admin.e403); },
          404: function () { bootbox.alert(Admin.e404); }
        }
      });
    }
  },
};

$(function () {
  var uid = $.cookie("userid");
  if (uid) Admin.enable(uid);
  else     Admin.disable();
});
