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
      var min_size = body.innerHeight();
      var max_size = body[0].scrollHeight;

      if (min_size < max_size) {
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

      head.find(".post-reply-btn").on('click', function () {
        $(".post-form:not(.tpl)").collapse("hide");

        if (!post.find('.post-form').length) {
          var form = $('.post-form.tpl').clone().removeClass('tpl hidden');
          form.find('[name="parent"]').attr('value', post.attr('id'));
          form.find('[type="file"]').each(Core.FileInputs.entry);
          form.appendTo(post).on('hidden.bs.collapse', function () { form.remove(); }).collapse('show');
        }
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
