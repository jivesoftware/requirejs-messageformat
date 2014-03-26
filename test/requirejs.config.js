requirejs.config({
	"baseUrl": "..",

	"paths": {
		"messageformat": "bower_components/messageformat/messageformat",
		"messageformat/locale": "bower_components/messageformat/locale",
        "json": "bower_components/requirejs-plugins/src/json",
        "text": "bower_components/requirejs-text/text"
	},

	"map": {
		"*": {
			"msgfmt": "src/msgfmt"
		}
	}
});
