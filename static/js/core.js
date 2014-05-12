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
    $(this).find(".post-form:not(.tpl)").each(Core.FileInputs.extend);
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
          form.each(Core.FileInputs.extend);
          form.appendTo(post).on('hidden.bs.collapse', function () { form.remove(); }).collapse('show');
        }
      });
    }
  },

  FileInputs: {
    extend: function () {
      var form     = $(this);
      var activate = function () { field.click();  };
      var remove   = function () { group.remove(); };
      var reset    = null;

      var group = $("<div class='input-group'>")
        .insertBefore(form.find('.input-group:last-child'));

      var control = $("<div class='input-group-addon btn btn-default'>")
        .append("<span class='fa fa-upload'>")
        .appendTo(group)
        .on('click', activate);

      var field = $("<input type='file' name='file' class='hidden'>")
        .appendTo(group)
        .on('change', function () {
          // The path is mangled to prevent whatever, only the filename is important.
          display.val(field.val().split("\\").pop().split("/").pop());

          // Some browsers support resetting file inputs.
          if (display.val() == '') remove();

          reset = $("<div class='input-group-addon btn btn-default'>")
            .append("<span class='fa fa-times'>")
            .appendTo(group)
            .on('click', remove);

          form.each(Core.FileInputs.extend);
        });

      var display = $("<input type='text' disabled class='form-control'>")
        .appendTo(group)
        .on('click', activate);
    }
  }
};


$(Core.enable);
