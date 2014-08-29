var config;
var matchdep = require('matchdep');
var module;

config = {
    files: {
        build: 'lib/marionette.babyBird.js',
        check: [
            'src/marionette.babyBird.js',
            'Gruntfie.js'
        ],
        dist: 'dist/marionette.babyBird.min.js',
        docs: 'docs',
        src: 'src/marionette.babyBird.js',
        tmp: 'tmp/marionette.babyBird.js'
    }
};

module.exports = function(grunt) {
    var endpoint = grunt.file.readJSON('bower.json').repository.url;
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
        semver: require('semver'),

        bowerRelease: {
            options: {
                endpoint: endpoint
            },
            deploy: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: [
                        'lib/**/*',
                        'dist/**/*',
                        '.*'
                    ]
                }]
            }
        },

        meta: {
            bundleBanner:
                '// marionette.babyBird\n' +
                '// -------------------\n' +
                '// v<%= semver.inc(pkg.version, grunt.config("bump.increment")) %>\n' +
                '//\n' +
                '// Annotated source code can be found here: http://useallfive.github.io/marionette.babyBird/marionette.babyBird.html\n' +
                '//\n' +
                '// Brought to you by [Use All Five, Inc.](http://www.useallfive.com)\n' +
                '// ```\n' +
                '// Author: Justin Anastos <janastos@useallfive.com>\n' +
                '// Author URI: [http://www.useallfive.com](http://www.useallfive.com)\n' +
                '// Repository: https://github.com/UseAllFive/marionette.babyBird\n' +
                '// ```\n' +
                '// Flatten deeply nested Backbone models and collections into a plain JavaScript object when using built-in Marionette.Renderer.\n' +
                '\n\n'
        },

        bump: {
            options: {
                commitFiles: [
                    'package.json',
                    'bower.json',
                    config.files.build,
                    config.files.dist
                ],
                files: [
                    'package.json',
                    'bower.json'
                ],
                push: true,
                pushTo: 'origin',
                updateConfigs: ['pkg']
            }
        },

        clean: {
            dist: 'dist',
            lib: 'lib',
            tmp: 'tmp'
        },

        concat: {
            options: {
                banner: '<%= meta.bundleBanner %>'
            },
            bundle: {
                src: '<%= preprocess.bundle.dest %>',
                dest: config.files.build
            }
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

        prompt: {
            bump: {
                options: {
                    questions: [
                        {
                            config: 'bump.increment',
                            type: 'list',
                            message: 'Bump version from ' + pkg.version.cyan + ' to:',
                            choices: [
                                {
                                    value: 'patch',
                                    name: 'Patch:  '.yellow +
                                        '<%= semver.inc(pkg.version, "patch") %>'.yellow +
                                        '   Backwards-compatible bug fixes.'
                                },
                                {
                                    value: 'minor',
                                    name: 'Minor:  '.yellow +
                                        '<%= semver.inc(pkg.version, "minor") %>'.yellow +
                                        '   Add functionality in a backwards-compatible manner.'
                                },
                                {
                                    value: 'major',
                                    name: 'Major:  '.yellow +
                                        '<%= semver.inc(pkg.version, "major") %>'.yellow +
                                        '   Incompatible API changes.'
                                }
                            ]
                        }
                    ]
                }
            }
        },

        preprocess: {
            bundle: {
                src: config.files.src,
                dest: config.files.tmp
            }
        },

        template: {
            options: {
                data: {
                    version: '<%= pkg.version %>'
                }
            },
            bundle: {
                src: '<%= preprocess.bundle.dest %>',
                dest: '<%= preprocess.bundle.dest %>'
            }
        },

        uglify: {
            all: {
                src: config.files.build,
                dest: config.files.dist
            }
        },

        watch: {
            options: {
                interrupt: true
            },
            js: {
                files: config.files.check,
                tasks: 'local:publish'
            }
        }
    });

     /**
     * Internal task to use the prompt settings to create a tag
     */
    grunt.registerTask('bump:prompt', function() {
        var increment = grunt.config('bump.increment');

        if (!increment) {
            grunt.fatal('bump.increment config not set!');
        }

        grunt.task.run('bump:' + increment);
    });

    // Load all npm dependencies.
    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', 'local:publish');
    grunt.registerTask('dev', ['local:publish', 'watch']);
    grunt.registerTask('publish', 'Pack up all the files into a single file, minify, and publish to bower.', [
        'jshint',
        'jscs',
        'prompt:bump',
        'clean:lib',
        'clean:tmp',
        'preprocess',
        'concat',
        'uglify',
        'bump:prompt',
        'bowerRelease'
    ]);
    grunt.registerTask('local:publish', 'Pack files up into a locally testable version. Same as publish, but without the actual bumping and publishing.', [
        'clean:lib',
        'clean:tmp',
        'preprocess',
        'concat',
        'uglify'
    ]);
};
