"use strict";

var Admin = {
  enable: function (uid) {
    $.cookie("userid", uid, { "expires": 365, "path": "/" });
    $("#admin-mode").text("Admin mode: on").click(function () {
      Admin.disable();
    });

    $(".post").each(Admin.Posts.entry);
    $(".board-index li").each(Admin.Boards.entry);
    $("body > .post-view-tree > .post:first-child").each(Admin.Threads.entry);
    // TODO add an UI for board creation.
    // TODO handle errors properly
  },

  disable: function () {
    $.removeCookie("userid", { "path": "/" });
    $(".admin").remove();
    $("#admin-mode").text("Admin mode: off").click(function () {
      // TODO query for a password.
      Admin.enable("yobapeka");
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
          403: function () { console.log("[errno 403]: cannot create board: " + board); }
        }
      });
    },

    del: function (board) {
      // TODO do something with empty categories
      var name = $(board).children("a[href]").attr("href");
      $(board).remove();
      $.ajax(name, {
        method:     "DELETE",
        statusCode: {
          200: function () { },
          403: function () { console.log("[errno 403]: cannot remove board: "  + name); },
          404: function () { console.log("[errno 404]: board does not exist: " + name); }
        }
      });
    }
  },

  Threads: {
    entry: function () {
      Admin.Posts.button(this, 'tree-close',  'Закрыть',    'stop',       Admin.Threads.close);
      Admin.Posts.button(this, 'tree-open',   'Открыть',    'play',       Admin.Threads.open);
      //Admin.Posts.button(this, 'tree-attach', 'Прикрепить', 'arrow-up',   Admin.Threads.attach);
      //Admin.Posts.button(this, 'tree-detach', 'Открепить',  'addow-down', Admin.Threads.detach);
    },

    close: function (thread) {
      var url = $(thread).find(".post-id").attr("href").split("#")[0];
      $(thread).parents(".post-view-tree").find(".post").addClass("post-closed");
      $.ajax(url + "close", {
        method:     "PUT",
        statusCode: {
          200: function () { },
          403: function () { console.log("[errno 403]: cannot close thread: "   + url); },
          404: function () { console.log("[errno 404]: thread does not exist: " + url); }
        }
      });
    },

    open: function (thread) {
      var url = $(thread).find(".post-id").attr("href").split("#")[0];
      $(thread).parents(".post-view-tree").find(".post").removeClass("post-closed");
      $.ajax(url + "close", {
        method:     "DELETE",
        statusCode: {
          200: function () { },
          403: function () { console.log("[errno 403]: cannot open thread: "    + url); },
          404: function () { console.log("[errno 404]: thread does not exist: " + url); }
        }
      });
    }
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
      $(post).remove();
      $.ajax("/" + board + "/" + pid + "/", {
        method:     "DELETE",
        statusCode: {
          200: function () { },
          403: function () { console.log("[errno 403]: cannot remove post: " + board + "/" + pid); }
        }
      });
    }
  },
};

$(function () {
  $(".thread-view-type").click(function () {
    $.cookie('view_type', $(this).attr("data-type"), {"expires": 365, "path": "/"});
    return true;
  });

  $(".post-content").each(function () {
    if (this.offsetHeight < this.scrollHeight) {
      var min_size = this.offsetHeight;
      var max_size = this.scrollHeight;

      var self = $(this);
      var ebtn = self.parents(".post").find(".post-expand-btn").show().click(function () {
        self.animate({'min-height': max_size}, 300);
        ebtn.hide();
        cbtn.show();
      });

      var cbtn = self.parents(".post").find(".post-collapse-btn").click(function () {
        self.animate({'min-height': min_size}, 300);
        cbtn.hide();
        ebtn.show();
      });
    }
  });

  $(".post-reply-btn").click(function () {
    $(".post-form:not(.collapse):not(" + $(this).attr("data-target") + ")").collapse("hide");
  });

  $("[type='file']").each(function () {
    var self = $(this);
    var reset   = null;
    var display = self.siblings(".adjacent-file-display");
    var control = self.siblings(".adjacent-file-control");

    self.change(function () {
      display.val(self.val().split("\\").pop().split("/").pop());
    });

    control.click(function () { self.click(); });
  });

  var uid = $.cookie("userid");

  if (uid) {
    Admin.enable(uid);
  } else {
    Admin.disable();
  }
});
