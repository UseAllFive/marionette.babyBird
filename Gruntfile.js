var config;
var matchdep = require('matchdep');
var module;

config = {
    files: {
        build: 'lib/marionette.babyBird.js',
        check: [
            'lib/marionette.babyBird.js',
            'Gruntfie.js'
        ],
        dest: 'dist/marionette.babyBird.min.js',
        docs: 'docs'
    }
};

module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');
    var defaultTasks;

    grunt.initConfig({
        pkg: pkg,

        clean: {
            dist: 'dist',
            docs: 'docs'
        },

        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                files: {
                    src: config.files.check
                }
            }
        },

        jscs: {
            all: {
                files: {
                    src: config.files.check
                }
            }
        },

        groc: {
            options: {
                out: config.files.docs,
                strip: 'lib/'
            },
            local: {
                src: config.files.build
            },
            github: {
                options: {
                    github: true
                },
                src: config.files.build
            }
        },

        uglify: {
            all: {
                src: config.files.build,
                dest: config.files.dest
            }
        },

        watch: {
            options: {
                interrupt: true
            },
            js: {
                files: config.files.check,
                tasks: ['clean', 'uglify', 'groc:local']
            }
        }
    });

    // Load all npm dependencies.
    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Register tasks.
    defaultTasks = [
        'clean',
        'jshint',
        'jscs',
        'groc:local',
        'uglify'
    ];
    grunt.registerTask('default', defaultTasks);
    grunt.registerTask('dev', defaultTasks.concat('watch'));
};
