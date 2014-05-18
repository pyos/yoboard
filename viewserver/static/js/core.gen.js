(function(){window.dialog={h3:function(message){return $('<h3 class="text-center">').text(message)},alert:function(message,callback){return bootbox.alert($("<p>").append(message).html(),callback)},loading:function(node){return $('<span class="loading-cover">').css("font-size",""+Math.max(14,Math.min(node.height(),node.width(),128)/4)+"px").append('<span class="fa fa-spin fa-circle-o-notch">').appendTo(node.addClass("loading"))},unloading:function(node){return node.removeClass("loading").find(".loading-cover").remove()}};window.core={board:$('meta[itemprop="board"]').attr("content"),theme:{choice:["Cosmo","Cyborg","Default","Flatly","Photon"],"default":"Photon",current:$('meta[itemprop="style"]').attr("content")||$.cookie("theme"),element:$("<link type='text/css' rel='stylesheet' />").prependTo("head"),set:function(name,update){if(update==null){update=true}core.theme.current=core.theme.choice.indexOf(name)>=0?name:core.theme["default"];core.theme.element.attr("href","/static/css/"+core.theme.current+".gen.css");if(update){$.cookie("theme",core.theme.current,{expires:365,path:"/"})}$(".board-style-type").removeClass("active");return $("#style-entry-"+core.theme.current).addClass("active")}},form:{hide:function(){return $(".post-form:not(.tpl)").collapse("hide")},create:function(id){var form;core.form.hide();form=$("#post-form-"+id);if(form.length){return form.collapse("toggle")}form=$(".post-form.tpl").clone().attr("id","post-form-"+id).removeClass("tpl hidden");form.ajaxForm({beforeSubmit:function(data,jq){return dialog.loading(jq)},success:function(data,a,b,jq){if(id===0){return location.href=""+jq.attr("action")+$(data).attr("id")}else{dialog.unloading(jq);core.form.reply(id,data);core.form.hide();return form.parents(".post-form").on("hidden.bs.collapse",function(){return $(this).remove()})}},error:function(data,a,b,jq){dialog.unloading(jq);return dialog.alert(data.status===404?"This board or thread no longer exists.":data.status===500?"Internal server error.":$(data.responseText).find("h3"))}});form.find('[name="parent"]').attr("value",id);form.each(core.form.addfile);form.appendTo(core.form.reply(id,form,true));return form.collapse("show")},reply:function(id,node,first){var post;if(id===0){return $(node).insertAfter($(".post-form.tpl"))}else{post=$("#"+id);while(!first&&post.next().hasClass("post-view-tree")){post=post.next()}return $(node).appendTo($('<div class="post-view-tree">').insertAfter(post))}},addfile:function(){var file,form,node,reset,text,trig;form=$(this);node=$('<div class="input-group">\n  <div class="input-group-addon btn btn-default"><i class="fa fa-upload"></i></div>\n  <input type="file" name="file" class="hidden">\n  <input type="text" disabled    class="form-control">\n  <div class="input-group-addon btn btn-default"><i class="fa fa-times"></i></div>\n</div>').insertBefore(form.find(".input-group:last-child"));reset=node.children().eq(3).remove().on("click",function(){return node.remove()});text=node.children().eq(2).on("click",function(){return file.click()});trig=node.children().eq(0).on("click",function(){return file.click()});return file=node.children().eq(1).on("change",function(){if(!text.val()){reset.appendTo(node);form.each(core.form.addfile)}return text.val(file.val().split("\\").pop().split("/").pop())})}},imageview:{create:function(){var view;core.imageview.node=view=$('<div class="imageview">\n  <a class="prev"><span class="fa fa-2x fa-chevron-left"></span></a>\n  <a class="next"><span class="fa fa-2x fa-chevron-right"></span></a>\n  <a class="back"><span class="fa fa-2x fa-times"></span></a>\n  <a class="link"><span></span></a>\n  <span class="wrap"><img class="view" /></span>\n</div>');view.find(".back").on("click",function(){return core.imageview.hide()});view.find(".prev").on("click",function(){return core.imageview.prev()});view.find(".next").on("click",function(){return core.imageview.next()});return view.appendTo(document.body)},show:function(node){var url;url=node.find("a").attr("href");core.imageview.current=node;if(!core.imageview.node){core.imageview.create()}core.imageview.node.find(".view").remove();core.imageview.node.find(".wrap").append(node.hasClass("video")?'<video controls preload="metadata" class="view">':'<img class="view">');core.imageview.node.find(".link").attr("href",url).children().text(url.split("/")[3]);core.imageview.node.find(".view").attr("src",url);return false},prev:function(node){var last,x,_i,_len,_ref;last=null;_ref=$(".media-object");for(_i=0,_len=_ref.length;_i<_len;_i++){x=_ref[_i];if(x===core.imageview.current[0]){if(last===null){return false}else{return core.imageview.show($(last))}}last=x}},next:function(node){var next,x,_i,_len,_ref;next=false;_ref=$(".media-object");for(_i=0,_len=_ref.length;_i<_len;_i++){x=_ref[_i];if(next){return core.imageview.show($(x))}if(x===core.imageview.current[0]){next=true}}},hide:function(){if(core.imageview.node){core.imageview.node.remove();return core.imageview.node=null}}}};core.theme.set(core.theme.current,false);$(function(){var t,_i,_len,_ref,_results;$(document).on("click",".thread-view-type",function(){return $.cookie("view_type",$(this).attr("data-type"),{expires:365,path:"/"})}).on("click",".board-style-type > a",function(){return core.theme.set($(this).text())}).on("click",".media-object > a",function(){return core.imageview.show($(this).parent())}).on("click",".core-new-thread",function(){return core.form.create(0)}).on("click",".core-reply",function(){return core.form.create($(this).parents(".post").attr("id"))});_ref=core.theme.choice;_results=[];for(_i=0,_len=_ref.length;_i<_len;_i++){t=_ref[_i];_results.push($("<li id='style-entry-"+t+"' />").addClass("board-style-type").append($("<a />").text(t)).appendTo("#style-selector").addClass(core.theme.current===t?"active":""))}return _results})}).call(this);