'use strict';

var paths = {
    js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/**/*.js', '!packages/**/node_modules/**'],
    html: ['packages/**/public/**/views/**', 'packages/**/server/views/**'],
    css: ['!bower_components/**', 'packages/**/public/**/css/*.css']
};

module.exports = function(grunt) {

    if (process.env.NODE_ENV !== 'production') {
        require('time-grunt')(grunt);
    }

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('config/assets.json'),
        clean: ['bower_components/build'],
        watch: {
            js: {
                files: paths.js
            },
            html: {
                files: paths.html,
                options: {
                    livereload: true,
                    interval: 2000
                }
            },
            css: {
                files: paths.css,
                options: {
                    livereload: true
                }
            }
        },
        uglify: {
            core: {
                options: {
                    mangle: false
                },
                files: '<%= assets.core.js %>'
            }
        },
        cssmin: {
            core: {
                files: '<%= assets.core.css %>'
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['node_modules/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'concurrent']);
    } else {
        grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'concurrent']);
    }

};