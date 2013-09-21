"use strict";

$(function () {
  $(".thread-view-type").click(function () {
    $.cookie('view_type', $(this).attr("data-type"), {"expires": 365, "path": "/"});
    return true;
  });

  $(".post-body").each(function () {
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

  var mimes = {
    "application": ["list-alt", "executable"]
  , "application/ecmascript": ["list-alt", "JS source"]
  , "application/gzip": ["compressed", "gz archive"]
  , "application/javascript": ["list-alt", "JS source"]
  , "application/json": ["list-alt", "JSON data"]
  , "application/msword": ["align-justify", "Word document"]
  , "application/octet-stream": ["file", "unknown type"]
  , "application/ogg": ["volume-up", "OGG media"]
  , "application/pdf": ["align-justify", "PDF"]
  , "application/postscript": ["align-justify", "PostScript"]
  , "application/rtf": ["align-justify", "rich text"]
  , "application/vnd.ms-word": ["align-justify", "Word document"]
  , "application/vnd.ms-excel": ["align-justify", "spreadsheet"]
  , "application/vnd.ms-powerpoint": ["align-justify", "presentation"]
  , "application/x-7z-compressed": ["compressed", "7z archive"]
  , "application/x-rar-compressed": ["compressed", "Roshal ARchive"]
  , "application/x-tar-compressed": ["compressed", "Tape ARchive"]
  , "application/zip": ["compressed", "zip archive"]
  , "audio": ["volume-up", "audio"]
  , "image": ["picture", "image"]
  , "text": ["align-justify", "plain text"]
  , "text/css": ["list-alt", "CSS"]
  , "text/html": ["list-alt", "HTML document"]
  , "text/javascript": ["list-alt", "JS source"]
  , "text/xml": ["list-alt", "XML data"]
  , "video": ["film", "video"]
  };

  $(".post").each(function () {
    var has_prefix = false;
    var header     = $(this).children(".post-header");

    $("[data-media-mime]", this).each(function (num) {
      var self = $(this);
      var type = self.attr("data-media-mime");
      var link = self.parent().attr("href");
      var data = mimes[type] || mimes[type.split("/")[0]] || ["file", "unknown type"];

      if (!has_prefix) {
        has_prefix = true;
        $("<span />").text(" | Файлы: ").appendTo(header);
      };

      $("<span />").addClass("glyphicon")
                   .addClass("glyphicon-" + data[0])
                   .appendTo($("<a />").attr("href", link).appendTo(header));
    });
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
