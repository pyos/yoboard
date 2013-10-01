"use strict";

var Admin = {
  prompt: "A TI KTO?",
  e403:   "Your powers do not work on this board.",
  e403g:  "Your powers are too weak to affect this page.",
  e404:   "You really ought to refresh the page. The stuff you're looking at doesn't even exist anymore.",

  eitherWay: function () {
    $('.admin-tree-attach').click(function () { Admin.Trees.attach($(this).parents(".post")); });
    $('.admin-tree-detach').click(function () { Admin.Trees.detach($(this).parents(".post")); });
    $('.admin-tree-close') .click(function () { Admin.Trees.close ($(this).parents(".post")); });
    $('.admin-tree-open')  .click(function () { Admin.Trees.open  ($(this).parents(".post")); });
    $('.admin-tree-rm')    .click(function () { Admin.Trees.del   ($(this).parents(".post")); });
    $(".admin-board-del")  .click(function () { Admin.Boards.del($(this).parents("tr")); })
    $(".admin-board-add")  .click(function () { Admin.Boards.prompt($(this).parents("table").siblings("h3").text()); });
    $('#admin-mode').click(Admin.toggle);

    var uid = $.cookie("userid");
    if (uid) Admin.enable(uid);
  },

  toggle: function () {
    if ($(document.body).hasClass("admin")) {
      $.removeCookie("userid", { "path": "/" });
      $(document.body).removeClass("admin");
    } else {
      bootbox.prompt(Admin.prompt, function (val) {
        if (val !== null) Admin.enable(val);
      });
    }
  },

  enable: function (uid) {
    $.cookie("userid", uid, { "path": "/" });
    $.ajax("/_ismod/", {
      dataType:   'json',
      statusCode: {
        403: function () { $.removeCookie("userid", { "path": "/" }); },
        200: function (data) {
          if (data === true || data.indexOf(location.pathname.split("/")[1]) >= 0)
            $(document.body).addClass("admin");
        }
      }
    });
  },

  Boards: {
    prompt: function (category) {
      var head = $('#admin-new-board-head').clone()
      var form = $('#admin-new-board-form').clone()
      form.find('#admin-new-board-cat').val(category);

      bootbox.dialog({
        title:   head,
        message: form,
        buttons: {
          OK: {
            className: "btn-primary",
            callback:  function () {
              var id    = form.find("#admin-new-board-id").val();
              var title = form.find("#admin-new-board-title").val();
              var cat   = form.find("#admin-new-board-cat").val();
              if (id && title && cat) Admin.Boards.add(id, title, cat);
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
      var name = $(board).find("a[href]").attr("href");
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

  Trees: {
    setState: function (thread, state, cls, enabled) {
      var url = thread.find(".post-id").attr("href").split("#")[0];
      $.ajax(url + state, {
        method:     enabled ? "PUT" : "DELETE",
        statusCode: {
          200: function () { $(thread).parents(".post-view-tree").find(".post").toggleClass(cls); },
          403: function () { bootbox.alert(Admin.e403); },
          404: function () { bootbox.alert(Admin.e404); }
        }
      });
    },

    del: function (post) {
      var board = post.find(".post-id").attr("href").split("/")[1];
      var pid   = post.attr("id");
      $.ajax("/" + board + "/" + pid + "/", {
        method:     "DELETE",
        statusCode: {
          200: function () { location.reload(); },
          403: function () { bootbox.alert(Admin.e403); },
          404: function () { bootbox.alert(Admin.e404); }
        }
      });
    },

    close:  function (thread) { Admin.Trees.setState(thread, "close",  "post-closed",   true);  },
    open:   function (thread) { Admin.Trees.setState(thread, "close",  "post-closed",   false); },
    attach: function (thread) { Admin.Trees.setState(thread, "attach", "post-attached", true);  },
    detach: function (thread) { Admin.Trees.setState(thread, "attach", "post-attached", false); }
  }
};


$(Admin.eitherWay);
