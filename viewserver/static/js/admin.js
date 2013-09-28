"use strict";

var Admin = {
  really: false,
  prompt: "A TI KTO?",
  e403:   "Your powers do not work on this board.",
  e403g:  "Your powers are too weak to affect this page.",
  e404:   "You really ought to refresh the page. The stuff you're looking at doesn't even exist anymore.",

  new_board_id:     "ID",
  new_board_cat:    "Category",
  new_board_title:  "Title",
  new_board_header: "Create a new board",
  new_board_text:   "Or update an existing one if the ID is already in use.",

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
            $(".board-index").each(Admin.Boards.entry_head);
            $("body > .post-view-tree > .post:first-child").each(Admin.Threads.entry);
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
                .attr("title", "Remove")
                .click(function () { Admin.Boards.del(board); })
                .prependTo(this).after(" ");
    },

    entry_head: function () {
      var cat = $(this).siblings("h3").text();
      $("<a />").addClass("admin-board-new")
                .addClass("glyphicon")
                .addClass("glyphicon-plus-sign")
                .attr("title", Admin.new_board_header)
                .click(function () { Admin.Boards.addPrompt(cat); })
                .appendTo($("<li />").addClass("admin").appendTo(this));
    },

    addPrompt: function (category) {
      var form = $("<p>" + Admin.new_board_text + "</p>\
        <div class='input-group'><input class='form-control' placeholder='" + Admin.new_board_id + "' id='new-board-id' /></div>\
        <div class='input-group'><input class='form-control' placeholder='" + Admin.new_board_title + "' id='new-board-title' /></div>\
        <div class='input-group'><input class='form-control' placeholder='" + Admin.new_board_cat + "' id='new-board-cat' /></div>");

      form.find("#new-board-cat").val(category);

      bootbox.dialog({
        title:   Admin.new_board_header,
        message: form,
        buttons: {
          OK: {
            className: "btn-primary",
            callback:  function (ok) {
              if (ok) {
                var id    = $("#new-board-id").val();
                var title = $("#new-board-title").val();
                var cat   = $("#new-board-cat").val();
                if (id && title && cat) Admin.Boards.add(id, title, cat);
              }
            }
          }
        }
      });
    },

    add: function (board, title, category) {
      $.ajax("/" + board + "/", {
        method:     "PUT",
        data:       { title: title, cat: category },
        statusCode: {
          200: function () { location.reload(); },
          403: function () { bootbox.alert(Admin.e403g); }
        }
      });
    },

    del: function (board) {
      var name = $(board).children("a[href]").attr("href");
      $.ajax(name, {
        method:     "DELETE",
        statusCode: {
          200: function () { location.reload(); },
          403: function () { bootbox.alert(Admin.e403g); },
          404: function () { bootbox.alert(Admin.e404);  }
        }
      });
    }
  },

  Threads: {
    entry: function () {
      Admin.Posts.button(this, 'tree-close',  'Close',  'floppy-remove', '.post-reply-btn',     Admin.Threads.close);
      Admin.Posts.button(this, 'tree-open',   'Open',   'floppy-saved',  '.post-reply-btn',     Admin.Threads.open);
      Admin.Posts.button(this, 'tree-attach', 'Attach', 'upload',        '.post-attached-mark', Admin.Threads.attach);
      Admin.Posts.button(this, 'tree-detach', 'Detach', 'unchecked',     '.post-attached-mark', Admin.Threads.detach);
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
      Admin.Posts.button(this, 'tree-rm', 'Remove', 'trash', '.post-reply-btn', Admin.Posts.del);
    },

    button: function (post, cls, title, icon, anchor, fn) {
      return $("<a />").addClass("admin")
                       .addClass("admin-" + cls)
                       .addClass("glyphicon")
                       .addClass("glyphicon-" + icon)
                       .attr("title", title)
                       .click(function () { fn(post); })
                       .insertAfter($(post).find(anchor)).after(" ").before(" ");
    },

    del: function (post) {
      var board = $(post).find(".post-id").attr("href").split("/")[1];
      var pid   = $(post).attr("id");
      $.ajax("/" + board + "/" + pid + "/", {
        method:     "DELETE",
        statusCode: {
          200: function () { location.reload(); },
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
