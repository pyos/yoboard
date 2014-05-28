window.admin =
  i18n:
    401: "Yoba Wants To Know Your Name"
    403: "Not On This Page, Buddy"
    404: "The Page You're Looking At Is Outdated"

  enable: (uid) ->
    dialog.loading $(document.body)
    $.cookie 'userid',   uid, path: '/'
    $.ajax   '/api/admin/',
      dataType:   'json'
      error:   (data) ->
        dialog.unloading $(document.body)
        $.removeCookie 'userid', path: '/'

      success: (data) ->
        dialog.unloading $(document.body)
        if data is true or data.indexOf(core.board) >= 0
          $('body').addClass 'admin'
        else if data isnt false
          $('body').addClass 'admin-not-here'

  request: (id, lock, path, opts) ->
    dialog.loading lock
    $.ajax "/#{id}#{path}",
      data:   opts.data
      method: opts.method
      success: ->
        dialog.unloading lock
        if opts.mandad? then opts.mandad() else location.reload()
      error: (data) ->
        dialog.unloading lock
        dialog.alert "Error \##{data.status}",
          if admin.i18n[data.status]?
          then admin.i18n[data.status]
          else $(data.responseText).find('h3').html() or '???'

  board:
    prompt: (category) ->
      # FIXME this way of templating is stupid.
      head = $('#admin-new-board-head').clone()
      form = $('#admin-new-board-form').clone()
      form.find('#admin-new-board-cat').val(category)
      dialog.create
        headingN: head,
        messageN: form,
        buttons:
          OK:
            cls:   'btn-success'
            click: ->
              id    = form.find('#admin-new-board-id')   .val()
              title = form.find('#admin-new-board-title').val()
              cat   = form.find('#admin-new-board-cat')  .val()
              admin.board.add id, title, cat if id and title and cat
          Cancel:
            cls: 'btn-danger'

    del: (id)                  -> admin.request id, $('body'), '/', method: 'DELETE'
    add: (id, title, category) -> admin.request id, $('body'), '/',
      method: 'PUT'
      data:
        title: title
        cat:   category

  tree:
    open:   (post) -> admin.tree.bool post, 'close',  false
    close:  (post) -> admin.tree.bool post, 'close',  true
    attach: (post) -> admin.tree.bool post, 'attach', true
    detach: (post) -> admin.tree.bool post, 'attach', false
    del:    (post) -> admin.request   post.attr('data-id'), $('body'), '/', method: 'DELETE'

    bool: (post, prop, value) -> admin.request post.attr('data-id'), post, "/#{prop}", 
      method: if value then 'PUT' else 'DELETE'
      mandad: -> post.toggleClass "prop-#{prop}"


$ ->
  $(document)
    .on 'click', '.adm-attach',  -> admin.tree.attach  $(this).parents '.post'
    .on 'click', '.adm-detach',  -> admin.tree.detach  $(this).parents '.post'
    .on 'click', '.adm-close',   -> admin.tree.close   $(this).parents '.post'
    .on 'click', '.adm-open',    -> admin.tree.open    $(this).parents '.post'
    .on 'click', '.adm-rmtree',  -> admin.tree.del     $(this).parents '.post'
    .on 'click', '.adm-crboard', -> admin.board.prompt $(this).attr 'data-cat'
    .on 'click', '.adm-rmboard', -> admin.board.del    $(this).attr 'data-id'
    .on 'click', '#admin-mode',  ->
      if $('body').hasClass    'admin'
         $('body').removeClass 'admin'
         $.removeCookie 'userid', path: '/'
      else
         dialog.prompt admin.i18n[401], (val) -> admin.enable val if val isnt null

  admin.enable $.cookie('userid') if $.cookie('userid')
