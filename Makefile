all: coffee

clean:
	find * \( -type d -empty -o -name '*.pyc' -o -name '*.gen.*' \) -delete

coffee:
	coffee -pc viewserver/static/js/core.coffee > viewserver/static/js/core.gen.js
	coffee -pc viewserver/static/js/admin.coffee > viewserver/static/js/admin.gen.js
