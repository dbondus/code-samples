module.exports = function(grunt){
    "use strict";

    require('matchdep').filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    //grunt.option('verbose', true);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
            prod: {
                options: {
                    sassDir: 'frontend/sass',
                    cssDir: 'backend/public/css',
                    fontsDir: '/fonts',

                    outputStyle: 'compressed',
                    noLineComments: true,
                    environment: 'production',

                    force: true,

                    specify: 'frontend/sass/main.sass'
                }
            },

            dev: {
                options: {
                    sassDir: 'frontend/sass',
                    cssDir: 'backend/public/css',
                    fontsDir: '/fonts',

                    outputStyle: 'expanded',
                    noLineComments: false,
                    environment: 'development',

                    force: true,

                    specify: 'frontend/sass/main.sass'
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: "frontend/js",
                    mainConfigFile: "frontend/js/require.config.js",

                    include: 'application',
                    name: 'almond',
                    out: "backend/public/js/main.js",

                    fileExclusionRegExp: /^\.|node_modules|Gruntfile|\.md|package.json/,

                    almond: true,
                    wrapShim: true,
                    wrap: true,
                    optimize: "none"
                }
            }
        },

		uglify: {
			options: {
				mangle: {
					mangleProperties: true,
					reserveDOMCache: true
				},
				compress: {
					drop_console: true
				}
			},
			target: {
				files: {
					'backend/public/js/main.js': ['backend/public/js/main.js']
				}
			}
		},

        jshint: {
            files: [
                'Gruntfile.js',

                'frontend/js/**/*.js',
                '!frontend/js/vendor/**/*.js'
            ],
            options: {
                curly: true,
                eqeqeq: true,
                latedef: true,
                noarg: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,

                globals: {
                    console: true,
                    require: true,
                    requirejs: true,
                    define: true,
                    module: true
                },

                '-W030': false, /* allow one line expressions */
                '-W014': false  /* allow breaking of '? :' */
            }
        },

        watch: {
            js: {
                files: [
                    'frontend/js/**/*.js',
                    'frontend/js/**/*.html'
                ],
                tasks: ['requirejs']
            },
            css: {
                files: [
                    'frontend/sass/**/*.sass',
                    'frontend/sass/**/*.scss'
                ],
                tasks: ['compass:dev']
            }
        },

        mocha: {
            index: ['frontend/tests/test-runner.html']
        }

    });

    grunt.registerTask('default', [
        'jshint',
		'compass:dev',
		'requirejs'
	]);
    grunt.registerTask('release', [
        'compass:prod',
        'requirejs',
		'uglify'
    ]);
};
