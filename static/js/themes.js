"use strict";


var theme_prefix  = "/static/css/nechan-";
var theme_postfix = ".css";
var theme_default = "photon";
var themes = {
  "bootstrap": "white",
  "photon":    "gray",
  "neutron":   "dark"
};


var inject_style = function (name) {
  var style = themes[name] || themes[theme_default];

  return $("<link />").attr("type", "text/css")
                      .attr("rel", "stylesheet")
                      .attr("href", theme_prefix + style + theme_postfix)
                      .appendTo("head");
};


var injected = inject_style($.cookie("style"));


$(function () {
  var options = $("#view-options");
  var current = $.cookie("style");

  if (!themes[current]) {
    current = theme_default;
  };

  if (options.length) {
    for (var k in themes) {
      var container = $("<li />").attr("class", "board-style-type");
      var child     = $("<a  />").attr("data-style", k).text(k).click(function () {
        var name = $(this).attr("data-style");
        injected.remove();
        injected = inject_style(name);
        $(".board-style-type").removeClass("active");
        $(this).parent().addClass("active");
        $.cookie("style", name, { "expires": 365, "path": "/" });
      });

      container.append(child).appendTo(options);
      if (k == current) container.addClass("active");
    };
  };
});
