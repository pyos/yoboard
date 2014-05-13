admin =
  i18n:
    401: "(401) Yoba Wants To Know Your Name"
    403: "(403) Not On This Page, Buddy"
    404: "(404) The Page You're Looking At Is Outdated"

  enable: (uid) ->
    $.cookie 'userid',   uid, path: '/'
    $.ajax   '/_ismod/',
      dataType:   'json'
      statusCode:
        403: ()     -> $.removeCookie 'userid', path: '/'
        200: (data) ->
          if data is true or data.indexOf(location.pathname.split("/")[1]) >= 0
            $('body').addClass 'admin'

  request: (id, path, opts) ->
    $.ajax "/#{id}#{path}",
      data:   opts.data
      method: opts.method
      statusCode:
        200: -> if opts.mandad? then opts.mandad() else location.reload()
        403: -> bootbox.alert admin.i18n[403]
        404: -> bootbox.alert admin.i18n[404]

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

    del: (id)                  -> admin.request id, '/', method: 'DELETE'
    add: (id, title, category) -> admin.request id, '/',
      method: 'PUT'
      data:
        title: title
        cat:   category

  tree:
    idof: (node) -> $(node).parents('.post').attr('data-id')
    open:   (id) -> admin.tree.bool id, 'close',  false
    close:  (id) -> admin.tree.bool id, 'close',  true
    attach: (id) -> admin.tree.bool id, 'attach', true
    detach: (id) -> admin.tree.bool id, 'attach', false
    del:    (id) -> admin.request   id, '/', method: 'DELETE'

    bool: (id, prop, value) -> admin.request id, "/#{prop}", 
      method: if value then 'PUT' else 'DELETE'
      mandad: -> $('#' + id.split('/')[1]).toggleClass "prop-#{prop}"


$ ->
  $(document)
    .on 'click', '.adm-attach',  -> admin.tree.attach  admin.tree.idof this
    .on 'click', '.adm-detach',  -> admin.tree.detach  admin.tree.idof this
    .on 'click', '.adm-close',   -> admin.tree.close   admin.tree.idof this
    .on 'click', '.adm-open',    -> admin.tree.open    admin.tree.idof this
    .on 'click', '.adm-rmtree',  -> admin.tree.del     admin.tree.idof this
    .on 'click', '.adm-crboard', -> admin.board.prompt $(this).attr 'data-cat'
    .on 'click', '.adm-rmboard', -> admin.board.del    $(this).attr 'data-id'
    .on 'click', '#admin-mode',  ->
      if $('body').hasClass    'admin'
         $('body').removeClass 'admin'
         $.removeCookie 'userid', path: '/'
      else
         bootbox.prompt admin.i18n[401], (val) -> admin.enable val if val isnt null

  admin.enable $.cookie('userid') if $.cookie('userid') isnt null
