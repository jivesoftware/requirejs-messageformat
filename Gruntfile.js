module.exports = function( grunt ) {
	"use strict";

	var srcHttpPort = Math.floor( 8000 + Math.random() * 1000 ),
		builtHttpPort = Math.floor( 9000 + Math.random() * 1000 );

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
				src: [
					"test/**/*.js",
					"!test/golden_files/**/*.js"
				]
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
				tagName: "v%s",
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
						"src/msgfmt.js",
						"!test/**/*.js"
					],
					instrumentedFiles: "temp/",
					htmlReport: "_tests/reports/coverage",
					lcovReport: "_tests/reports/lcov",
					linesThresholdPct: 0
				}
			},

			all: [ "test/*.html" ]
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

		connect: {
			src: {
				options: {
					port: srcHttpPort,
					base: ".",
				}
			},
			built: {
				options: {
					port: builtHttpPort,
					base: "_tests/build"
				}
			}
		},

		casper: {
			options: {
				test: true,
				"log-level": "debug",
			},
			"src": {
				options: {
					args: [ "--path=/test/functional/", "--port=" + srcHttpPort ]
				},
				src: [ "test/casperjs/msgfmtTest.js" ]
			},
			"built": {
				options: {
					args: [ "--path=/test/functional/", "--port=" + builtHttpPort ]
				},
				src: [ "test/casperjs/msgfmtTest.js" ]
			}
		},

		copy: {
			built: {
				options: {
					processContent: function( content, srcPath ) {
						if ( srcPath === "test/functional/index_fr.html" ) {
							content = content.replace( /main\.js/, "main_fr.js" );
						}
						return content;
					}
				},

				files: {
					"_tests/build/": [
						"bower_components/**",
						"test/requirejs.config.js",
						"test/functional/**"
					]
				}
			}
		},

		requirejs: {
			options: {
				baseUrl: ".",

				mainConfigFile: "test/requirejs.config.js",

				preserveLicenseComments: true,

				optimize: "none",

				insertRequire: [ "test/functional/main" ]
			},

			en: {
				options: {
					name: "test/functional/main",

					out: "_tests/build/test/functional/main.js"
				}
			},

			fr: {
				options: {
					locale: "fr",

					name: "test/functional/main",

					out: "_tests/build/test/functional/main_fr.js"
				}
			}
		},

		clean: {
			testOut: [ "_tests" ],
			coverageOut: [ "_tests/coverage" ],
			buildOut: [ "_tests/build" ]
		}
	});

	// grunt plugins
	require( "load-grunt-tasks" )( grunt );

	grunt.registerTask( "lint", [ "jshint", "jscs" ]);

	grunt.registerTask( "test:integration", [ "clean:coverageOut", "qunit" ] );

	grunt.registerTask( "test:functional.src", [ "connect:src", "casper:src" ] );
	grunt.registerTask( "test:functional.built", [ "copy:built", "requirejs", "connect:built", "casper:built" ] );
	grunt.registerTask( "test:functional", [ "test:functional.src", "test:functional.built" ] );

	grunt.registerTask( "test", [ "lint", "test:integration", "test:functional" ] );

	grunt.registerTask( "build", [ "clean:buildOut", "copy:testBuild", "requirejs" ] );
};
