/**
 * Created by jfagan on 3/6/15.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        //browserify: {
        //    app: {
        //        bundleOptions: {
        //            debug: true
        //        },
        //        options: {
        //            transform: function() {
        //                var browserify = require('browserify');
        //                var fs = require('fs');
        //                var b = browserify()
        //            },
        //            debug: true,
        //            external: ['jquery','lodash', 'backbone', 'backbone.marionette']
        //        },
        //        src: ['oe/oe.js'],
        //        dest: 'built.js'
        //    }
        //},
        execute: {
            target: {
                src: ['browserify-jstify.js']
            }
        },
        watch: {
            app: {
                tasks: ['execute'],
                files: ['oe/**'],
                options: {
                    livereload: true
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');
};
