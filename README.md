requirejs-messageformat [![Build Status](https://travis-ci.org/gseguin/requirejs-messageformat.png?branch=master)](https://travis-ci.org/gseguin/requirejs-messageformat) [![Coverage Status](https://coveralls.io/repos/gseguin/requirejs-messageformat/badge.png?branch=master)](https://coveralls.io/r/gseguin/requirejs-messageformat?branch=master)
=======================

RequireJS plugin to consume MessageFormat resource bundles

## Dependencies
This plugin depends on Alex Sexton's [MessageFormat.js](https://github.com/SlexAxton/messageformat.js) library as well as the text! and json! plugins.

The MessageFormat library must live in your source tree under a path that you'll alias as shown in the sample RequireJS config below.

## RequireJS config

Here is how your RequireJS config should look like:

```javascript
requirejs.config({
	"paths": {
        "messageformat": "bower_components/messageformat/messageformat",
        "messageformat/locale": "bower_components/messageformat/locale"
    },

    "map": {
        "*": {
            "text": "bower_components/requirejs-text/text",
            "json": "bower_components/requirejs-plugins/src/json",
            "mgfmt": "bower_components/requirejs-messageformat/msgfmt"
        }
    }
})
```

## Author

* Ghislain Seguin - [@gseguin](http://twitter.com/gseguin)


## Credits

Thanks to:

* [Jive Software](https://jivesoftware.com) - my employer - for letting me contribute back to the community.
* [James Burke](https://github.com/jrburke) - The author or RequireJS and the [text!](https://github.com/requirejs/text) and [i18n!](https://github.com/requirejs/i18n) plugins from which this plugin is highly inspired (copied) from.
* [Alex Sexton](http://twitter.com/SlexAxton) for porting MessageFormat to JavaScript and allowing real internationalization as opposed to good translation
