module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'public/main.js': ['client/main.js']
        }
      }
    },
    uglify: {
      options:{
        compress: true
      },
      production: {
        files: {
          'public/main.min.js': ['public/main.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['client/**/*.js'],
        tasks: ['browserify'],
         options: {
          spawn: false,
        },
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('build', ['browserify', 'uglify']);
  grunt.registerTask('default', ['watch']);

};