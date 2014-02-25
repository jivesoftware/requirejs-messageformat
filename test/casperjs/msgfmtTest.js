/*global casper: false, __utils__: false */

var host = casper.cli.get( "host" ) || "localhost",
	port = casper.cli.get( "port" ) || 80,
	path = casper.cli.get( "path" );

casper.test.begin("English page should show English", 2, function suite(test) {
	casper.start( "http://" + host + ":" + port + path + "index.html" );

	casper.then( function() {
		test.assertExists( "#fixture" );
	});

	casper.waitForSelectorTextChange( "#fixture", function() {
		test.assertEvalEquals(function() {
			return __utils__.findOne( "#fixture" ).textContent;
		}, "They just found 2 results in 2 categories.");
	});

	casper.run(function() {
		test.done();
	});
});

casper.test.begin("French page should show French", 2, function suite(test) {
	casper.start( "http://" + host + ":" + port + path + "index_fr.html" );

	casper.then( function() {
		test.assertExists( "#fixture" );
	});

	casper.waitForSelectorTextChange( "#fixture", function() {
		test.assertEvalEquals(function() {
			return __utils__.findOne( "#fixture" ).textContent;
		}, "On a trouvé 2 resultats dans 2 categories.");
	});

	casper.run(function() {
		test.done();
	});
});