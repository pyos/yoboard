"use strict";

$(function () {
  $(".thread-view-type").click(function () {
    $.cookie('view_type',
      $(this).attr("data-type"),
      { "expires": 365, "path": "/" }
    );
    return true;
  });
});
