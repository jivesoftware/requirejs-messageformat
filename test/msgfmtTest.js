define( [ "msgfmt" ], function() {
	// Deal with mapped module ids
	var moduleId = requirejs.s.contexts._.makeModuleMap( "msgfmt", null, false, true ).id;

	module( "requirejs-messageformat", {
		setup: function() {
			requirejs.undef( moduleId );
		},
		teardown: function() {
			requirejs.undef( moduleId + "!test/nls/resources" );
			requirejs.undef( moduleId );
		}
	});

	asyncTest( "root", function() {
		expect( 9 );

		require([ "msgfmt!test/nls/resources" ], function( i18n ) {

			equal( i18n[ "minutes ago" ]( { num: 1 } ), "1 minute ago" );
			equal( i18n[ "minutes ago" ]( { num: 2 } ), "2 minutes ago" );

			equal( i18n[ "found results" ](
				{
					GENDER: "female",
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "1"
				}), "She just found one result in one category." );

			equal( i18n[ "found results" ](
				{
					GENDER: "male",
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "1"
				}), "He just found one result in one category." );

			equal( i18n[ "found results" ](
				{
					GENDER: "other",
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "1"
				}), "They just found one result in one category." );

			equal( i18n[ "found results" ](
				{
					GENDER: "male",
					NUM_RESULTS: "0",
					NUM_CATEGORIES: "1"
				}), "He just found 0 results in one category." );

			equal( i18n[ "found results" ](
				{
					GENDER: "other",
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "2"
				}), "They just found one result in 2 categories." );

			equal( i18n[ "found results" ](
				{
					GENDER: "other",
					NUM_RESULTS: "2",
					NUM_CATEGORIES: "1"
				}), "They just found 2 results in one category." );

			equal( i18n[ "found results" ](
				{
					GENDER: "other",
					NUM_RESULTS: "2",
					NUM_CATEGORIES: "2"
				}), "They just found 2 results in 2 categories." );

			start();
		});
	});

	asyncTest( "fr", function() {
		expect( 9 );
//		requirejs.config({
//			config: (function() {
//				var o = {};
//				o[ moduleId ] = {
//					locale: "fr"
//				};
//				return o;
//			}())
//		});

		requirejs.config({
			locale: "fr-fr",
//			config: {
//				//Set the config for the i18n
//				//module ID
//				msgfmt: {
//					locale: "fr-fr"
//				}
//			}
		});

		require( [ "msgfmt!test/nls/resources" ], function( i18n ) {

			equal( i18n[ "minutes ago" ]( { num: 1 } ), "Il y a 1 minute" );
			equal( i18n[ "minutes ago" ]( { num: 2 } ), "Il y a 2 minutes" );

			equal( i18n[ "found results" ](
				{
					GENDER: "female",
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "1"
				}), "Elle a trouvé un resultat dans une categorie." );

			equal( i18n[ "found results" ](
				{
					GENDER: "male",
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "1"
				}), "Il a trouvé un resultat dans une categorie." );

			equal( i18n[ "found results" ](
				{
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "1"
				}), "On a trouvé un resultat dans une categorie." );

			equal( i18n[ "found results" ](
				{
					GENDER: "male",
					NUM_RESULTS: "0",
					NUM_CATEGORIES: "1"
				}), "Il a trouvé 0 resultat dans une categorie." );

			equal( i18n[ "found results" ](
				{
					NUM_RESULTS: "1",
					NUM_CATEGORIES: "2"
				}), "On a trouvé un resultat dans 2 categories." );

			equal( i18n[ "found results" ](
				{
					NUM_RESULTS: "2",
					NUM_CATEGORIES: "1"
				}), "On a trouvé 2 resultats dans une categorie." );

			equal( i18n[ "found results" ](
				{
					NUM_RESULTS: "2",
					NUM_CATEGORIES: "2"
				}), "On a trouvé 2 resultats dans 2 categories." );

			start();
		});
	});

	asyncTest( "root", function() {
		expect( 1 );

		require( [ "text!test/golden_files/nls/resources.built.text" ], function( goldenResources ) {
			require( [ "../bower_components/r.js/dist/r.js" ], function() {
				requirejs.browser = {
					saveFile: function( fileName, fileContents /*, encoding*/ ) {
						console.log( "saveFile called: " + fileName + ":\n" + fileContents);
					}
				};

				requirejs.optimize({
					baseUrl: "..",

					"paths": {
						"bower_components": "bower_components",
						"messageformat": "bower_components/messageformat/messageformat",
						"messageformat/locale": "bower_components/messageformat/locale",
						"test": "test"
					},

					"map": {
						"*": {
							"text": "bower_components/requirejs-text/text",
							"json": "bower_components/requirejs-plugins/src/json",
							"msgfmt": "src/msgfmt"
						}
					},

					compileMessageFormat: true,

					optimize: "none",

					name: "msgfmt!test/nls/resources",

					out: function( text ) {
						equal( text.trim().split( "\n" ).pop(), goldenResources );
					}
				}, function( /* buildText */ ) {
					start();
				});
			});
		});
	});
});
