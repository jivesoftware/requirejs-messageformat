requirejs.config({
	"baseUrl": "..",

	"paths": {
		"messageformat": "bower_components/messageformat/messageformat",
		"messageformat/locale": "bower_components/messageformat/locale"
	},

	"map": {
		"*": {
			"text": "bower_components/requirejs-text/text",
			"msgfmt": "src/msgfmt"
		}
	}
});
