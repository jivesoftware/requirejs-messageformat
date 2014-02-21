requirejs-messageformat
=======================

RequireJS plugin to consume MessageFormat resource bundles
=======

### Dependencies
This plugin depends on Alex Sexton's MessageFormat library as well as the text! and json! plugins.

The MessageFormat library must live in your source under a path that you'll alias as shown in the sample RequireJS config below.

### RequireJS config

Here is how your RequireJS config should look like:

```javascript
requirejs.config({
    "paths": {
        "requirejs-plugins": "third-party/requirejs-plugins"

        // libraries
        "messageformat": "third-party/messageformat/messageformat",
        "messageformat/locale": "third-party/messageformat/locale"
    },

    maps: {
        "*": {
            // requireJS plugins
            "text": "requirejs-plugins/text",
            "json": "requirejs-plugins/json",
            "msgfmt": "requirejs-plugins/msgfmt"
        }
    }
})
```