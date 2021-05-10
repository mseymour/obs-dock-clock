/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    'dart-sass': {
      target: {
        files: {
          '../dist/assets/dock.css': 'assets/scss/dock.scss'
        }
      }
    },
    stylelint: {
      options: {
        configFile: '../.stylelint.rc.json',
      },
      all: ['assets/**/*.scss']
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: {
          '../dist/assets/dock.js': 'assets/js/dock.js'
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        node: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      build: {
        src: ['assets/**/*.js']
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'htdocs/',
            src: ['**'],
            dest: '../dist/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'node_modules/obs-websocket-js/dist/',
            src: [
              'obs-websocket.min.js',
              'obs-websocket.min.js.map',
            ],
            dest: '../dist/assets/',
            filter: 'isFile'
          }
        ]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint', 'stylelint', 'dart-sass', 'babel', 'copy']
      },
      build: {
        files: [
          'assets/**/*.js',
          'assets/**/*.scss',
          'htdocs/**/*'
        ],
        tasks: ['copy', 'jshint', 'stylelint', 'dart-sass', 'babel']
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['copy', 'jshint', 'stylelint', 'dart-sass', 'babel']);

};
