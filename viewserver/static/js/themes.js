"use strict";

var current = $.cookie("style") || "photon";
var themes  = {"bootstrap": "white",
               "photon":    "gray",
               "neutron":   "dark"};


var theme_get = function (name) {
  return "/static/css/nechan-" + (themes[name] || themes["photon"]) + ".css";
}


var injected = $("<link type='text/css' rel='stylesheet' />")
  .attr("href", theme_get(current))
  .appendTo("head");


$(function () {
  var options = $("#view-options");

  for (var k in themes) {
    var container = $("<li />").attr("class", "board-style-type");
    var child     = $("<a  />").attr("data-style", k).text(k).click(function () {
      current = $(this).attr("data-style");
      injected.attr("href", theme_get(current));
      $(".board-style-type").removeClass("active");
      $(this).parent().addClass("active");
      $.cookie("style", current, { "expires": 365, "path": "/" });
    });

    container.append(child).appendTo(options);
    if (k == current) container.addClass("active");
  };
});
