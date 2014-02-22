module.exports = function( grunt ) {
	"use strict";

	grunt.config.init( {
		pkg: grunt.file.readJSON( "package.json" ),

		jshint: {
			src: {
				options: {
					jshintrc: "src/.jshintrc"
				},
				src: [ "src/**/*.js" ]
			},
			test: {
				options: {
					jshintrc: "test/.jshintrc"
				},
				src: [ "test/**/*.js" ]
			},
			gruntfile: {
				options: {
					jshintrc: ".jshintrc"
				},
				files: {
					src: [ "Gruntfile.js" ]
				}
			}
		},

		jscs: {
			options: {
				config: ".jscs.json",
			},
			gruntfile: [ "Gruntfile.js" ],
			src: [ "src/*.js" ],
			test: [ "test/*.js" ]
		},

		sync: {
			all: {
				options: {
					// sync specific options
					sync: [ "author", "name" ]
				}
			}
		},

		"release-it": {
			options: {
				pkgFiles: [ "package.json", "bower.json" ],
				commitMessage: "Release %s",
				tagName: 'v%s',
				tagAnnotation: "Release %s",
				buildCommand: false
			}
		},

		qunit: {
			options: {
				timeout: 30000,
				"--web-security": "no",
				coverage: {
					src: [
						"src/msgfmt.js"
					],
					instrumentedFiles: "temp/",
					htmlReport: "_tests/reports/coverage",
					lcovReport: "_tests/reports/lcov",
					linesThresholdPct: 0
				}
			},

			all: [ "test/**/*.html" ]
		},

		coveralls: {
			options: {
				force: true
			},
			all: {

				// LCOV coverage file relevant to every target
				src: "_tests/reports/lcov/lcov.info"
			}
		},

		clean: {
			testOut: [ "_tests" ]
		}
	});

	// grunt plugins
	require( "load-grunt-tasks" )( grunt );

	grunt.registerTask( "test", [ "jshint", "jscs", "clean:testOut", "qunit" ] );
};
