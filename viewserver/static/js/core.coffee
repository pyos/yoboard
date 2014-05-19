window.delay  = (t, f) -> window.setTimeout(f, t)
window.abort  = (dtid) -> window.clearTimeout(dtid)
window.dialog =
  h3: (message) ->
    # `bootbox.alert "something"` displays stuff in really tiny text.
    $('<h3 class="text-center">').text(message)

  alert: (message, callback) ->
    # Default `bootbox.alert` does not support jquery elements as contents.
    bootbox.alert $('<p>').append(message).html(), callback

  loading: (node) ->
    $('<span class="loading-cover">')
      .css 'font-size', "#{Math.max(14, Math.min(node.height(), node.width(), 128) / 4)}px"
      .append '<span class="fa fa-spin fa-circle-o-notch">'
      .appendTo node.addClass 'loading'

  unloading: (node) ->
    node.removeClass 'loading'
        .find('.loading-cover').remove()

  tooltip: (node, parent, padding=10) ->
    viewport =
      x: $(window).scrollLeft()
      y: $(window).scrollTop()
      w: $(window).width()
      h: $(window).height()

    _pabspos  = parent.offset()
    parentpos =
      x:  _pabspos.left - viewport.x
      y:  _pabspos.top  - viewport.y
      rx: _pabspos.left
      ry: _pabspos.top
      w:  parent.width()
      h:  parent.height()

    nodepos =
      w: node.width()
      h: node.height()

    # 1. Vertical alignment.
    #    `node` should be displayed at the top of `parent` iff
    #    it will not fit into the viewport otherwise but will fit that way.
    if parentpos.y - nodepos.h > padding and parentpos.y + nodepos.h + padding > viewport.h
    then node.css 'top', parentpos.ry - nodepos.h - parentpos.h
    else node.css 'top', parentpos.ry + parentpos.h
    # 2. Horizontal alignment.
    #    Same thing, different direction.
    if parentpos.x - nodepos.w > padding and parentpos.x + nodepos.w + padding > viewport.w
    then node.css 'left', parentpos.rx - nodepos.w
    else node.css 'left', parentpos.rx

window.core =
  board: $('meta[itemprop="board"]').attr('content')
  theme:
    choice: ['Cosmo', 'Cyborg', 'Default', 'Flatly', 'Photon']
    default: 'Photon'
    current: $('meta[itemprop="style"]').attr('content') || $.cookie('theme')
    element: $("<link type='text/css' rel='stylesheet' />").prependTo("head")

    set: (name, update=true) ->
      core.theme.current = if core.theme.choice.indexOf(name) >= 0 then name else core.theme.default
      core.theme.element.attr 'href', "/static/css/#{core.theme.current}.gen.css"
      if update then $.cookie 'theme', core.theme.current, expires: 365, path: '/'
      $('.board-style-type').removeClass('active')
      $("\#style-entry-#{core.theme.current}").addClass('active')

  form:
    hide:   ()   -> $('.post-form:not(.tpl)').collapse('hide')
    create: (id) ->
      core.form.hide()
      form = $("#post-form-#{id}")
      return form.collapse('toggle') if form.length

      # FIXME this is a shitty way of templating.
      form = $('.post-form.tpl').clone().attr('id', "post-form-#{id}").removeClass('tpl hidden')
      form.ajaxForm
        beforeSubmit: (data, jq) -> dialog.loading jq
        success:      (data, a, b, jq) ->
          if id is 0
            # Redirect to the thread page.
            location.href = "#{jq.attr('action')}#{$(data).attr('id')}"
          else
            dialog.unloading jq
            core.form.reply id, data
            core.form.hide()
            form.parents('.post-form').on 'hidden.bs.collapse', -> $(this).remove()

        error: (data, a, b, jq) ->
          dialog.unloading jq
          dialog.alert(
            if      data.status == 404 then 'This board or thread no longer exists.'
            else if data.status == 500 then 'Internal server error.'
            else $(data.responseText).find('h3') 
          )

      form.find('[name="parent"]').attr 'value', id
      form.each core.form.addfile
      form.appendTo core.form.reply(id, form, true)
      form.collapse 'show'

    reply: (id, node, first) ->
      if id is 0
        $(node).insertAfter $('.post-form.tpl')
      else
        post = $("\##{id}")
        while not first and post.next().hasClass('post-view-tree')
          # `post` will point to the last `post-view-tree` or the `#{id}` itself.
          post = post.next()
        $(node).appendTo $('<div class="post-view-tree">').insertAfter(post)

    addfile: () ->
      form = $(this)
      node = $("""
        <div class="input-group">
          <div class="input-group-btn">
            <div class="btn btn-default upload-file-button"><i class="fa fa-upload"></i></div>
            <div class="btn btn-default upload-link-button"><i class="fa fa-link"></i></div>
          </div>
          <input type="file" name="file" class="upload-file-select hidden">
          <input name="link" disabled    class="upload-link-select form-control">
          <div class="input-group-addon btn btn-default upload-nope"><i class="fa fa-times"></i></div>
        </div>
      """).insertBefore form.find '.input-group:last-child'

      full  = false
      fill  = ->
        if not full
          reset.appendTo node
          form.each core.form.addfile
          full = true

      reset = node.find('.upload-nope').remove()
      text  = node.find('.upload-link-select')
      file  = node.find('.upload-file-select')
      node
        .on 'change', '.upload-file-select', ->
          fill()
          # The path is mangled to prevent whatever, only the filename is important.
          text.val file.val().split("\\").pop().split("/").pop()
          text.attr 'disabled', 'true'
        .on 'click', '.upload-nope',        -> node.remove()
        .on 'click', '.upload-file-button', -> file.click()
        .on 'click', '.upload-link-button', ->
          fill()
          text.val('').removeAttr 'disabled'
          # Stupid lousy NECESSARY AND COMPLETELY JUSTIFIED security restrictions.
          file = file.replaceWith '<input type="file" name="file" class="upload-file-select hidden">'

  imageview:
    create: () ->
      core.imageview.node = view = $("""
        <div class="imageview">
          <a class="prev"><span class="fa fa-chevron-left"></span></a>
          <a class="next"><span class="fa fa-chevron-right"></span></a>
          <a class="back"><span class="fa fa-times"></span></a>
          <a class="mini"><span class="fa fa-compress"></span></a>
          <a class="maxi"><span class="fa fa-expand"></span></a>
          <a class="link"><span></span></a>
          <span class="wrap"><img class="view" /></span>
        </div>
      """)
      view.find('.back').on 'click', -> core.imageview.hide()
      view.find('.prev').on 'click', -> core.imageview.prev()
      view.find('.next').on 'click', -> core.imageview.next()
      view.find('.mini').on 'click', -> core.imageview.node.addClass    'minimized'
      view.find('.maxi').on 'click', -> core.imageview.node.removeClass 'minimized'
      view.appendTo(document.body)

    show: (node) ->
      url = node.find('a').attr('href')
      core.imageview.current = node
      core.imageview.create() if not core.imageview.node
      core.imageview.node.find('.view').remove()
      core.imageview.node.find('.wrap').append(
        if node.hasClass('video')
          '<video controls preload="metadata" class="view">'
        else if node.hasClass('youtube')
          _yt = node.find('a').attr('data-id')
          "<iframe class='view' width='100%' height='100%' src='//www.youtube.com/embed/#{_yt}' frameborder='0' allowfullscreen></iframe>"
        else
          '<img class="view">')
      core.imageview.node.find('.link').attr('href', url).children().text(url.split('/')[3])
      core.imageview.node.find('.view').attr('src',  url)
      return false

    prev: (node) ->
      last = null
      for x in $('.media-object')
        if x is core.imageview.current[0]
          return if last is null then false else core.imageview.show $(last)
        last = x

    next: (node) ->
      next = false
      for x in $('.media-object')
        return core.imageview.show $(x) if next
        next = true if x is core.imageview.current[0]

    hide: () ->
      if core.imageview.node
         core.imageview.node.remove()
         core.imageview.node = null

  preview:
    gcmap:   {}
    gcdelay: 300

    idof:   (node) -> "#{node.parents('.post').first().attr('id')}-#{node.attr('data-id')}"
    exists: (node, id) -> $("\#post-preview-#{id}").length > 0
    toggle: (node, id) ->
      if   core.preview.exists node, id
      then core.preview.hide   node, id
      else core.preview.show   node, id
      return false

    show: (node, id) ->
      return core.preview.unhide node, id if core.preview.gcmap[id]?
      return null                         if core.preview.exists node, id

      url    = node.attr('href')
      parent = node.parents('.post.preview')
      offset = node.position()
      target = $("<div class='post preview' id='post-preview-#{id}'>")
        .on 'mouseenter', -> $(this).trigger 'yoboard.preview.retain'
        .on 'mouseleave', -> $(this).trigger 'yoboard.preview.remove'
        .on 'yoboard.preview.retain', ->
          core.preview.show node, id
          parent.trigger 'yoboard.preview.retain'
        .on 'yoboard.preview.remove', ->
          core.preview.hide node, id
          parent.trigger 'yoboard.preview.remove'
        .appendTo document.body

      dialog.tooltip target, node
      dialog.loading target
      $.ajax url,
        method:  'GET'
        success: (data) ->
          target.append($(data).children())
          dialog.unloading target
          dialog.tooltip   target, node
        error: (data) ->
          target.append($(data).find('h3'))
          dialog.unloading target
          dialog.tooltip   target, node

    hide: (node, id) ->
      return null if     core.preview.gcmap[id]?
      return null if not core.preview.exists node, id
      core.preview.gcmap[id] = delay core.preview.gcdelay, ->
        $("\#post-preview-#{id}").remove()
        delete core.preview.gcmap[id]

    unhide: (node, id) ->
      return null if not core.preview.gcmap[id]?
      return null if not core.preview.exists node, id
      abort  core.preview.gcmap[id]
      delete core.preview.gcmap[id]


core.theme.set core.theme.current, false

$ ->
  $(document)
    .on 'click', '.thread-view-type',     -> $.cookie 'view_type', $(this).attr('data-type'), expires: 365, path: '/'
    .on 'click', '.board-style-type > a', -> core.theme.set $(this).text()
    .on 'click', '.media-object > a',     -> core.imageview.show $(this).parent()
    .on 'click', '.core-new-thread',      -> core.form.create 0
    .on 'click', '.core-reply',           -> core.form.create $(this).parents('.post').attr('id')
    .on 'click',      '.post-anchor',     -> core.preview.toggle $(this), core.preview.idof $(this)
    .on 'mouseenter', '.post-anchor',     -> core.preview.show   $(this), core.preview.idof $(this)
    .on 'mouseleave', '.post-anchor',     -> core.preview.hide   $(this), core.preview.idof $(this)

  for t in core.theme.choice
    $("<li id='style-entry-#{t}' />").addClass("board-style-type")
      .append   $("<a />").text(t)
      .appendTo "#style-selector"
      .addClass if core.theme.current == t then "active" else ""
