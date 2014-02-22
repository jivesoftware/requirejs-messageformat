/*jslint regexp: true */
/*global require: false, navigator: false, define: false */

/**
 * This plugin handles msgfmt! prefixed modules. It's heavily inspired (copied) from James Burke's
 * i18n plugin. I works the same but handles MessageFormat strings. It does the following:
 *
 * 1) A regular module can have a dependency on a MessageFormat i18n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like "msgfmt!nls/colors".
 *
 * This plugin will load the MessageFormat i18n bundle at nls/colors, see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is "en-us",
 * then the plugin will ask for the "en-us", "en" and "root" bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/colors bundle to be that mixed in locale.
 *
 * 2) A regular module specifies a specific locale to load. For instance,
 * msgfmt!nls/fr-fr/colors. In this case, the plugin needs to load the master bundle
 * first, at nls/colors, then figure out what the best match locale is for fr-fr,
 * since maybe only fr or just root is defined for that locale. Once that best
 * fit is found, all of its locale pieces need to have their bundles loaded.
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/fr-fr/colors bundle to be that mixed in locale.
 */
(function() {
	"use strict";

	//regexp for reconstructing the master bundle name from parts of the regexp match
	//nlsRegExp.exec("foo/bar/baz/nls/en-ca/foo") gives:
	//["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
	//nlsRegExp.exec("foo/bar/baz/nls/foo") gives:
	//["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
	//so, if match[5] is blank, it means this is the top bundle definition.
	var nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;

	function processModuleName( moduleName ) {
		if ( /\.json$/.test( moduleName ) ) {
			moduleName =  "json!" + moduleName;
		}
		return moduleName;
	}

	//Helper function to avoid repeating code. Lots of arguments in the
	//desire to stay functional and support RequireJS contexts without having
	//to know about the RequireJS contexts.
	function addPart( locale, master, needed, toLoad, prefix, suffix ) {
		if ( master[locale] ) {
			needed.push( locale );
			if ( master[locale] === true || master[locale] === 1 ) {
				toLoad.push( prefix + locale + "/" + suffix );
			}
		}
	}

	function addIfExists( req, locale, toLoad, prefix, suffix ) {
		var fullName = prefix + locale + "/" + suffix;
		if ( require._fileExists( req.toUrl( fullName ) ) ) {
			toLoad.push( processModuleName( fullName ) );
		}
	}

	/**
	 * Simple function to mix in properties from source into target,
	 * but only if target does not already have a property of the same name.
	 * This is not robust in IE for transferring methods that match
	 * Object.prototype names, but the uses of mixin here seem unlikely to
	 * trigger a problem related to that.
	 */
	function mixin( target, source, force ) {
		var prop;
		for ( prop in source ) {
			if ( source.hasOwnProperty( prop ) && (!target.hasOwnProperty( prop ) || force) ) {
				target[prop] = source[prop];
			}
		}
	}

	define([ "module", "messageformat", "text", "json" ], function( module, MessageFormat, text, json ) {
		var masterConfig = module.config(),
			buildMap = {},
			pluralizerBuildMap = {};

		function compile( bundle, locale, req, callback ) {
			if ( locale ) {
				locale = locale.toLowerCase();
			}
			if ( locale === "root" ) {
				locale = "en";
			}

			function _compile() {
				var key, val,
					mf = new MessageFormat( locale ),
					returnee = {};

				for ( key in bundle ) {
					val = bundle[ key ];
					if ( typeof val === "string" ) {
						returnee[ key ] = mf.compile( val );
					} else if ( typeof val === "function" || typeof val === "boolean" ) {
						// if it's a function it is already compiled
						// if it's a boolean it should be to indicate the availability of a locale
						returnee[ key ] = val;
					}
				}
				callback( returnee );
			}

			if ( locale && !MessageFormat.locale[ locale ] ) {
				text.get( req.toUrl( "messageformat/locale/" + ( locale === "root" ? "en" : locale ) + ".js" ),
					function( content ) {
						pluralizerBuildMap[ locale ] = content;
						/* jshint -W061 */
						eval( content );
						/* jshint +W061 */
						_compile();
					}, function( err ) {
						if ( callback.error ) {
							callback.error( err );
						}
					}
				);
			} else {
				_compile();
			}
		}

		return {
			version: "0.0.1",

			/**
			 * Called when a dependency needs to be loaded.
			 */
			load: function( name, req, onLoad, config ) {
				config = config || {};

				if ( config.locale ) {
					masterConfig.locale = config.locale;
				}

				var masterName,
					match = nlsRegExp.exec( name ),
					prefix = match[1],
					locale = match[4],
					suffix = match[5],
					parts = locale.split( "-" ),
					toLoad = [],
					value = {},
					i, part, current = "",
					count = 0;

				//If match[5] is blank, it means this is the top bundle definition,
				//so it does not have to be handled. Locale-specific requests
				//will have a match[4] value but no match[5]
				if ( match[5] ) {
					//locale-specific bundle
					prefix = match[1];
					masterName = prefix + suffix;
				} else {
					//Top-level bundle.
					masterName = name;
					suffix = match[4];
					locale = masterConfig.locale;
					if ( !locale ) {
						locale = masterConfig.locale =
							typeof navigator === "undefined" ? "root" :
								(navigator.language ||
									navigator.userLanguage || "root").toLowerCase();
					}
					parts = locale.split( "-" );
				}

				if ( config.isBuild ) {
					//Check for existence of all locale possible files and
					//require them if exist.
					toLoad.push( processModuleName( masterName ) );
					addIfExists( req, "root", toLoad, prefix, suffix );
					for ( i = 0; i < parts.length; i++ ) {
						part = parts[i];
						current += (current ? "-" : "") + part;
						addIfExists( req, current, toLoad, prefix, suffix );
					}

					if ( config.compileMessageFormat ) {
						toLoad.forEach( function( b ) {
							var moduleName = b.substring( 5 );
							json.load( moduleName, req, function( o ) {
								var bundle = {};
								// Use mixin to do the assignment to buildMap as it filters out
								// invalid attributes
								mixin( bundle, JSON.parse( o ) );

								compile( bundle, parts[0], req, function( data ) {
									count++;
									buildMap[ moduleName ] = data;
									if ( count === toLoad.length ) {
										onLoad();
									}
								});
							}, config );
						});
					} else {
						req( toLoad, function() {
							text.get(
								req.toUrl( "messageformat/locale/" + ( parts[0] === "root" ? "en" : parts[0] ) + ".js" ),
								function( content ) {
									pluralizerBuildMap[ locale ] = content;
									onLoad();
								}
							);
						});
					}
				} else {
					//First, fetch the master bundle, it knows what locales are available.
					json.load( masterName, req, function( master ) {
						//Figure out the best fit
						var needed = [],
							part,
							onResourceBundleLoad;

						onResourceBundleLoad = function( rb ) {
							var i, partBundle, part;
							for ( i = needed.length - 1; i > -1 && needed[ i ]; i-- ) {
								part = needed[ i ];
								partBundle = master[ part ];
								if ( partBundle === true || partBundle === 1 ) {
									partBundle = rb;
								}
								mixin( value, partBundle );
							}

							mixin( value, master );

							compile( value, part, req, onLoad );
						};

						//Always allow for root, then do the rest of the locale parts.
						addPart( "root", master, needed, toLoad, prefix, suffix );
						for ( i = 0; i < parts.length; i++ ) {
							part = parts[i];
							current += (current ? "-" : "") + part;
							addPart( current, master, needed, toLoad, prefix, suffix );
						}

						if ( toLoad.length ) {
							//Load all the parts missing.
							for ( i = 0; i < toLoad.length; i++ ) {
								json.load( toLoad[i], req, onResourceBundleLoad, config );
							}
						} else {
							mixin( value, master );

							compile( value, "root", req, onLoad );
						}
					}, config );
				}
			},

			//write method based on RequireJS official text plugin by James Burke
			//https://github.com/jrburke/requirejs/blob/master/text.js
			write: function( pluginName, moduleName, write ) {
				var bundle, content, key, locale;

				for ( locale in pluralizerBuildMap ) {
					write( "// Installs MessageFormat '" + locale + "' locale" );
					write( "require( ['messageformat'], function( MessageFormat ) { " + pluralizerBuildMap[ locale ] + " });\n" );
					// Include that locale only once.
					delete pluralizerBuildMap[ locale ];
				}
				if ( moduleName in buildMap ) {
					bundle = buildMap[ moduleName ];
					content = "{";

					for ( key in bundle ) {
						content += "\"" + key + "\": ";
						content += "" + bundle[ key ] + ", ";
					}
					if ( content.length > 1 ) {
						content = content.substring( 0, content.length - 2 );
					}
					content += "}";

					write( "define('json!" + moduleName + "', [ 'messageformat' ], function( MessageFormat ){ return " + content + ";});\n" );
				}
			}
		};
	});
}());
