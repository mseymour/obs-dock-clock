/*global module:false*/
module.exports = function(grunt) {

  /**
   * Project configuration.
   */

  const babel = require('@rollup/plugin-babel').default;

  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),


    // Copy dependency assets to dist
    copy: {
      htdocs: {
        files: [
          {
            expand: true,
            cwd: 'htdocs/',
            src: ['**'],
            dest: '../dist/',
            filter: 'isFile'
          }
        ]
      },
      node_modules: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'node_modules/',
            src: [
              'obs-websocket-js/dist/obs-websocket.min.js',
              'obs-websocket-js/dist/obs-websocket.min.js.map',
              'normalize.css/normalize.css'
            ],
            dest: '../dist/assets/'
          }
        ]
      }
    },

    // Sass Processing & Linting
    'dart-sass': {
      target: {
        files: {
          '../dist/assets/main.css': 'assets/scss/main.scss'
        }
      }
    },
    postcss: {
      options: {
        map: {
            inline: false,
            annotation: '../dist/assets/'
        },
        processors: [
          require('autoprefixer')(),
          require('cssnano')()
        ]
      },
      dist: {
        src: '../dist/assets/**/*.css'
      }
    },
    stylelint: {
      options: {
        configFile: '../.stylelint.rc.json',
      },
      all: ['assets/**/*.scss']
    },

    // ECMAScript/JS Processing & Linting
    rollup: {
      options: {
        sourceMap: true,
        plugins: [
          babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env'],
            exclude: './node_modules/**'
          })
        ]
      },
      build: {
        files: {
          '../dist/assets/main.js': 'assets/js/main.js'
        }
      }
    },
    jshint: {
      options: {
        esversion: 6
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      build: {
        src: ['assets/**/*.js']
      }
    },

    // Development
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['copy', 'stylelint', 'dart-sass', 'postcss', 'jshint', 'rollup']
      },
      build: {
        files: [
          'assets/**/*.{scss,js}',
          'htdocs/**/*'
        ],
        tasks: ['copy', 'stylelint', 'dart-sass', 'postcss', 'jshint', 'rollup']
      }
    }
  });

  // Automatically load all grunt task dependencies
  require('load-grunt-tasks')(grunt);

  // Default task
  grunt.registerTask('default', ['copy', 'stylelint', 'dart-sass', 'postcss', 'jshint', 'rollup']);

};
