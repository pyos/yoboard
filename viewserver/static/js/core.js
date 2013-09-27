"use strict";


var Core = {
  enable: function () {
    if (this === document) {
      $(".thread-view-type").click(function () {
        $.cookie('view_type', $(this).attr('data-type'), {"expires": 365, "path": "/"});
        return true;
      });
    }

    $(this).find(".post").each(Core.Posts.entry);
    $(this).find("[type='file']").each(Core.FileInputs.entry);
  },

  Posts: {
    entry: function () {
      var post = $(this);
      var body = post.find(".post-content");
      var head = post.find(".media-heading");

      if (body.innerHeight() < body[0].scrollHeight) {
        var min_size = body.innerHeight();
        var max_size = body[0].scrollHeight;

        post.addClass("post-expandable");
        head.find(".post-expand-btn").click(function () {
          body.animate({'min-height': max_size}, 300);
          post.addClass('post-expanded');
        });

        head.find(".post-collapse-btn").click(function () {
          body.animate({'min-height': min_size}, 300);
          post.removeClass("post-expanded");
        });
      }

      head.find(".post-reply-btn").click(function () {
        $(".post-form:not(.collapse):not(#board-form):not(" + $(this).attr("data-target") + ")").collapse("hide");
      });
    }
  },

  FileInputs: {
    entry: function () {
      var self = $(this);
      var reset   = null;
      var display = self.siblings(".adjacent-file-display");
      var control = self.siblings(".adjacent-file-control");

      self.change(function () {
        display.val(self.val().split("\\").pop().split("/").pop());
      });

      control.click(function () { self.click(); });
    }
  }
};


$(Core.enable);
