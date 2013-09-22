"use strict";

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
    $(".post-form:not(.collapse):not(#board-form):not(" + $(this).attr("data-target") + ")").collapse("hide");
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
});
