/**
 * Created by jfagan on 3/6/15.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        execute: {
            target: {
                src: ['openeddi-build.js']
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
