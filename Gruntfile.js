(function() {
    'use strict';

    module.exports = function(grunt) {

        grunt.initConfig({
            jshint: {
                options: {
                    newcap: false
                },
                all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
            },
            browserify: {
                'build/all.js': 'src/main.js'
            },
            watch: {
                dev: {
                    files: ['src/**/*.js'],
                    tasks: ['usetheforce_on', 'build', 'usetheforce_off'],
                    options: {
                        livereload: true
                    }
                }
            },
            connect: {
                options: {
                    port: 8008,
                    hostname: 'localhost',
                    base: '.'
                },
                dev: {
                    options: {
                        middleware: function(connect, options) {
                            return [
                                require('connect-livereload')(),
                                connect.static(options.base)
                            ];
                        }
                    }
                }
            },
            open: {
                dev: {
                    path: 'http://localhost:8008/index.dev.html'
                }
            },
            uglify: {
                nomin: {
                    options: {
                        mangle: false,
                        compress: false,
                        beautify: true
                    },
                    files: {
                        'build/all.js': ['build/all.js']
                    }
                },
                min: {
                    files: {
                        'build/all.min.js': ['build/all.js']
                    }
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-open');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-contrib-uglify');

        // Workaround to force continuation when encountering errors
        // during development cycle (for watch / livereload)
        grunt.registerTask('usetheforce_on', '// force the force option', function() {
            if (!grunt.option('force')) {
                grunt.config.set('usetheforce', true);
                grunt.option('force', true);
            }
        });
        grunt.registerTask('usetheforce_off', '// remove the force option', function() {
            if (grunt.config.get('usetheforce')) {
                grunt.option('force', false);
            }
        });

        grunt.registerTask('develop', 'Setup development server and watch files',
                           ['usetheforce_on', 'build', 'connect', 'open',
                               'watch:dev', 'usetheforce_off']);
        grunt.registerTask('build', 'Combine and compress source for the frontend',
                          ['browserify', 'uglify']);

        grunt.registerTask('default', ['develop']);

    };
})();
