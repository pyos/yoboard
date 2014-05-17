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


window.core =
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
          dialog.unloading jq
          if id is 0
            # Redirect to the thread page.
            location.href = "#{jq.attr('action')}#{$(data).attr('id')}"
          else
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
          <div class="input-group-addon btn btn-default"><i class="fa fa-upload"></i></div>
          <input type="file" name="file" class="hidden">
          <input type="text" disabled    class="form-control">
          <div class="input-group-addon btn btn-default"><i class="fa fa-times"></i></div>
        </div>
      """).insertBefore form.find '.input-group:last-child'

      reset = node.children().eq(3).remove().on 'click', -> node.remove()
      text  = node.children().eq(2).on 'click',  -> file.click()
      trig  = node.children().eq(0).on 'click',  -> file.click()
      file  = node.children().eq(1).on 'change', ->
        if not text.val()
          reset.appendTo node
          form.each core.form.addfile
        # The path is mangled to prevent whatever, only the filename is important.
        text.val file.val().split("\\").pop().split("/").pop()

  imageview:
    create: () ->
      core.imageview.node = view = $("""
        <div class="imageview">
          <a class="prev"><span class="fa fa-2x fa-chevron-left"></span></a>
          <a class="next"><span class="fa fa-2x fa-chevron-right"></span></a>
          <a class="back"><span class="fa fa-2x fa-times"></span></a>
          <a class="link"><span></span></a>
          <span class="wrap"><img class="view" /></span>
        </div>
      """)
      view.find('.back').on 'click', -> core.imageview.hide()
      view.find('.prev').on 'click', -> core.imageview.prev()
      view.find('.next').on 'click', -> core.imageview.next()
      view.appendTo(document.body)

    show: (node) ->
      url = node.find('a').attr('href')
      core.imageview.current = node
      core.imageview.create() if not core.imageview.node
      core.imageview.node.find('.view').remove()
      core.imageview.node.find('.wrap').append(
        if node.hasClass('video')
          '<video controls preload="metadata" class="view">'
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

core.theme.set core.theme.current, false

$ ->
  $(document)
    .on 'click', '.thread-view-type',     -> $.cookie 'view_type', $(this).attr('data-type'), expires: 365, path: '/'
    .on 'click', '.board-style-type > a', -> core.theme.set $(this).text()
    .on 'click', '.media-object > a',     -> core.imageview.show $(this).parent()
    .on 'click', '.core-new-thread',      -> core.form.create 0
    .on 'click', '.core-reply',           -> core.form.create $(this).parents('.post').attr('id')

  for t in core.theme.choice
    $("<li id='style-entry-#{t}' />").addClass("board-style-type")
      .append   $("<a />").text(t)
      .appendTo "#style-selector"
      .addClass if core.theme.current == t then "active" else ""
