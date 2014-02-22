define( [ "msgfmt" ], function() {
	// Deal with mapped module ids
	var moduleId = requirejs.s.contexts._.makeModuleMap( "msgfmt", null, false, true ).id;

	module( "requirejs-messageformat", {
		setup: function() {
			requirejs.undef( moduleId );
		},
		teardown: function() {
			requirejs.undef( moduleId + "!test/nls/resources.json" );
			requirejs.undef( moduleId );
		}
	});

	asyncTest( "root", function() {
		expect( 9 );

		require([ "msgfmt!test/nls/resources.json" ], function( i18n ) {

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
		requirejs.config({
			config: (function() {
				var o = {};
				o[ moduleId ] = {
					locale: "fr"
				};
				return o;
			}())
		});

		require( [ "msgfmt!test/nls/resources.json" ], function( i18n ) {

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
});
