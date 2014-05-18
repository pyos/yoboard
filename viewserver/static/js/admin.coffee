window.admin =
  i18n:
    401: "401 — Yoba Wants To Know Your Name"
    403: "403 — Not On This Page, Buddy"
    404: "404 — The Page You're Looking At Is Outdated"

  enable: (uid) ->
    dialog.loading $(document.body)
    $.cookie 'userid',   uid, path: '/'
    $.ajax   '/_ismod/',
      dataType:   'json'
      success: -> dialog.unloading $(document.body)
      error:   -> dialog.unloading $(document.body)
      statusCode:
        403: ()     -> $.removeCookie 'userid', path: '/'
        200: (data) ->
          if data is true or data.indexOf(core.board) >= 0
            $('body').addClass 'admin'
          else
            $('body').addClass 'admin-not-here'

  request: (id, lock, path, opts) ->
    dialog.loading lock
    $.ajax "/#{id}#{path}",
      data:   opts.data
      method: opts.method
      success: -> dialog.unloading lock if opts.mandad?
      error:   -> dialog.unloading lock
      statusCode:
        200: -> if opts.mandad? then opts.mandad() else location.reload()
        403: -> dialog.alert dialog.h3 admin.i18n[403]
        404: -> dialog.alert dialog.h3 admin.i18n[404]

  board:
    prompt: (category) ->
      # FIXME this way of templating is stupid.
      head = $('#admin-new-board-head').clone()
      form = $('#admin-new-board-form').clone()
      form.find('#admin-new-board-cat').val(category)
      bootbox.dialog
        title:   head,
        message: form,
        buttons: OK:
          className: "btn-primary"
          callback:  ->
            id    = form.find('#admin-new-board-id')   .val()
            title = form.find('#admin-new-board-title').val()
            cat   = form.find('#admin-new-board-cat')  .val()
            admin.board.add id, title, cat if id and title and cat

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
         bootbox.prompt admin.i18n[401], (val) -> admin.enable val if val isnt null

  admin.enable $.cookie('userid') if $.cookie('userid')
