js  := viewserver/static/js/
css := viewserver/static/css/

sass     := sass --style compressed --unix-newlines
coffee   := coffee -pc
uglifyjs := uglifyjs

all: sass coffee

clean:
	find * \( -type d -empty -o -name '*.pyc' -o -name '*.gen.*' \) -delete

coffee:
	$(coffee) "$(js)core.coffee"  | $(uglifyjs) > "$(js)core.gen.js"
	$(coffee) "$(js)admin.coffee" | $(uglifyjs) > "$(js)admin.gen.js"

sass:
	$(sass) "$(css)Cosmo.sass"   > "$(css)Cosmo.gen.css"
	$(sass) "$(css)Cyborg.sass"  > "$(css)Cyborg.gen.css"
	$(sass) "$(css)Default.sass" > "$(css)Default.gen.css"
	$(sass) "$(css)Flatly.sass"  > "$(css)Flatly.gen.css"
	$(sass) "$(css)Photon.sass"  > "$(css)Photon.gen.css"
