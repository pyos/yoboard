core =
  view:
    get: ()  -> location.pathname.split('/')[3]
    fav: ()  -> $.cookie 'view_type' || 'list'
    set: (t) -> $.cookie 'view_type', t, expires: 365, path: '/'

  theme:
    choice: ['Cosmo', 'Cyborg', 'Default', 'Flatly', 'Photon']
    default: 'Photon'
    current: null
    element: null
    set: (name) ->
      core.theme.current = if core.theme.choice.indexOf(name) >= 0 then name else core.theme.default
      core.theme.element.attr 'href', "/static/css/#{core.theme.current}-theme.css"
      $.cookie 'theme', core.theme.current, expires: 365, path: '/'

  form:
    hide:   ()   -> $('.post-form:not(.tpl):not(.toplevel)').collapse('hide')
    exists: (id) -> $("##{id} .post-form").length
    create: (id) ->
      form = $('.post-form.tpl').clone().removeClass('tpl hidden')
      form.find('[name="parent"]').attr('value', id)
      form

    addfile: () ->
      form     = $(this);
      activate = -> field.click()
      remove   = -> group.remove()
      reset    = null;

      group = $("<div class='input-group'>")
        .insertBefore form.find '.input-group:last-child'

      control = $("<div class='input-group-addon btn btn-default'>")
        .append "<span class='fa fa-upload'>"
        .appendTo group
        .on 'click', activate

      field = $("<input type='file' name='file' class='hidden'>")
        .appendTo group
        .on 'change', ->
          # The path is mangled to prevent whatever, only the filename is important.
          display.val field.val().split("\\").pop().split("/").pop()

          # Some browsers support resetting file inputs.
          remove() if display.val() == ''

          if reset is null
            reset = $("<div class='input-group-addon btn btn-default'>")
              .append "<span class='fa fa-times'>"
              .appendTo group
              .on 'click', remove
            # +1 field
            form.each core.form.addfile

      display = $("<input type='text' disabled class='form-control'>")
        .appendTo group
        .on 'click', activate


if not $("[data-theme-override]").length
  core.theme.element = $("<link type='text/css' rel='stylesheet' />").prependTo("head")
  core.theme.set $.cookie("theme")


$ ->
  $(document)
    .on 'hidden.bs.collapse', '.post-form', -> $(this).remove()
    .on 'click', '.thread-view-type', ->
      core.view.set $(this).attr('data-type')
      core.view.get() != core.view.fav()
    .on 'click', '.board-style-type > a', ->
      core.theme.set $(this).text()
      $('.board-style-type').removeClass('active')
      $(this).parent().addClass('active')

    .on 'click', '.core-reply', -> 
      post = $(this).parents('.post')
      id   = post.attr('id')
      if   not core.form.exists id
        form = core.form.create id
        form.appendTo(post).each(core.form.addfile).collapse('show')
      core.form.hide()

    .find('.post-form:not(.tpl)').each(core.form.addfile)

  for t in core.theme.choice
    $("<li />").addClass("board-style-type")
      .append $("<a />").text(t)
      .appendTo "#view-options"
      .addClass (if core.theme.current == t then "active" else "")