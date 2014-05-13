"use strict";


var Theme = {
    choice: ["bootstrap", "photon", "neutron"]
  , default: "photon"
  , current: null
  , element: null
  , select: function (name) {
      Theme.current = Theme.choice.indexOf(name) >= 0 ? name : Theme.default;
      Theme.element.attr("href", "/static/css/yoba-theme-" + Theme.current + ".css");
      $.cookie("theme", Theme.current, { "expires": 365, "path": "/" });
    }
}


if (!$("[data-theme-override]").length) {
  Theme.element = $("<link type='text/css' rel='stylesheet' />").appendTo("head");
  Theme.select($.cookie("theme"));

  $(function () {
    for (var i = 0; i < Theme.choice.length; i++)
      $("<li />").addClass("board-style-type")
        .append($("<a />").text(Theme.choice[i]))
        .appendTo("#view-options")
        .addClass(Theme.current == Theme.choice[i] ? "active" : "");

    $(".board-style-type > a").click(function () {
      Theme.select($(this).text());
      $(".board-style-type").removeClass("active");
      $(this).parent().addClass("active");
    });
  });
}
