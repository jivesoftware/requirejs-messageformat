define( [ "msgfmt!test/nls/resources" ], function( i18n ){
	document.getElementById( "fixture" ).innerHTML =
		i18n[ "found results" ]({ NUM_RESULTS: "2",NUM_CATEGORIES: "2" });
	console.log( "ready!" );
});
