(function(){var core;core=window.core={view:{get:function(){return location.pathname.split("/")[3]},fav:function(){return $.cookie("view_type"||"list")},set:function(t){return $.cookie("view_type",t,{expires:365,path:"/"})}},theme:{choice:["Cosmo","Cyborg","Default","Flatly","Photon"],"default":"Photon",current:$('meta[itemprop="style"]').attr("content")||$.cookie("theme"),element:$("<link type='text/css' rel='stylesheet' />").prependTo("head"),set:function(name,update){if(update==null){update=true}core.theme.current=core.theme.choice.indexOf(name)>=0?name:core.theme["default"];core.theme.element.attr("href","/static/css/"+core.theme.current+".gen.css");if(update){return $.cookie("theme",core.theme.current,{expires:365,path:"/"})}}},form:{hide:function(){return $(".post-form:not(.tpl):not(.toplevel)").collapse("hide")},exists:function(id){return $("#"+id+" .post-form").length},create:function(id){var form;form=$(".post-form.tpl").clone().removeClass("tpl hidden");form.find('[name="parent"]').attr("value",id);return form},addfile:function(){var activate,control,display,field,form,group,remove,reset;form=$(this);activate=function(){return field.click()};remove=function(){return group.remove()};reset=null;group=$("<div class='input-group'>").insertBefore(form.find(".input-group:last-child"));control=$("<div class='input-group-addon btn btn-default'>").append("<span class='fa fa-upload'>").appendTo(group).on("click",activate);field=$("<input type='file' name='file' class='hidden'>").appendTo(group).on("change",function(){display.val(field.val().split("\\").pop().split("/").pop());if(display.val()===""){remove()}if(reset===null){reset=$("<div class='input-group-addon btn btn-default'>").append("<span class='fa fa-times'>").appendTo(group).on("click",remove);return form.each(core.form.addfile)}});return display=$("<input type='text' disabled class='form-control'>").appendTo(group).on("click",activate)}},imageview:{create:function(){var view;core.imageview.node=view=$('<div class="imageview">\n  <a class="prev"><span class="fa fa-2x fa-chevron-left"></span></a>\n  <a class="next"><span class="fa fa-2x fa-chevron-right"></span></a>\n  <a class="back"><span class="fa fa-2x fa-times"></span></a>\n  <a class="link"><span></span></a>\n  <span class="wrap"><img class="view" /></span>\n</div>');view.find(".back").on("click",function(){return core.imageview.hide()});view.find(".prev").on("click",function(){return core.imageview.prev()});view.find(".next").on("click",function(){return core.imageview.next()});return view.appendTo(document.body)},show:function(node){var url;url=node.find("a").attr("href");core.imageview.current=node;if(!core.imageview.node){core.imageview.create()}core.imageview.node.find(".view").remove();core.imageview.node.find(".wrap").append(node.hasClass("video")?'<video controls preload="metadata" class="view">':'<img class="view">');core.imageview.node.find(".link").attr("href",url).children().text(url.split("/")[3]);return core.imageview.node.find(".view").attr("src",url)},prev:function(node){var last,x,_i,_len,_ref;last=null;_ref=$(".media-object");for(_i=0,_len=_ref.length;_i<_len;_i++){x=_ref[_i];if(x===core.imageview.current[0]){if(last===null){return false}else{return core.imageview.show($(last))}}last=x}},next:function(node){var next,x,_i,_len,_ref;next=false;_ref=$(".media-object");for(_i=0,_len=_ref.length;_i<_len;_i++){x=_ref[_i];if(next){return core.imageview.show($(x))}if(x===core.imageview.current[0]){next=true}}},hide:function(){if(core.imageview.node){core.imageview.node.remove();return core.imageview.node=null}}}};core.theme.set(core.theme.current,false);$(function(){var t,_i,_len,_ref,_results;$(document).on("hidden.bs.collapse",".post-form",function(){return $(this).remove()}).on("click",".thread-view-type",function(){core.view.set($(this).attr("data-type"));return core.view.get()!==core.view.fav()}).on("click",".board-style-type > a",function(){core.theme.set($(this).text());$(".board-style-type").removeClass("active");return $(this).parent().addClass("active")}).on("click",".media-object > a",function(ev){if((ev.which||ev.button)<2){core.imageview.show($(this).parent());return false}else{return true}}).on("click",".core-reply",function(){var form,id,post;post=$(this).parents(".post");id=post.attr("id");if(!core.form.exists(id)){form=core.form.create(id);form.appendTo(post).each(core.form.addfile).collapse("show")}return core.form.hide()}).find(".post-form:not(.tpl)").each(core.form.addfile);_ref=core.theme.choice;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){t=_ref[_i];_results.push($("<li />").addClass("board-style-type").append($("<a />").text(t)).appendTo("#view-options").addClass(core.theme.current===t?"active":""))}return _results})}).call(this);