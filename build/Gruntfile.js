/*global module:false*/
module.exports = function(grunt) {

  /**
   * Project configuration.
   */

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
        files: {
          expand: true,
          cwd: 'node_modules/',
          src: [
            'obs-websocket-js/dist/obs-websocket.min.js',
            'obs-websocket-js/dist/obs-websocket.min.js.map',
            'normalize.css/normalize.css'
          ],
          dest: '../dist/assets/'
        }
      }
    },

    // Sass Processing & Linting
    'dart-sass': {
      target: {
        files: {
          '../dist/assets/dock.css': 'assets/scss/dock.scss'
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

    // Development
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['copy', 'jshint', 'stylelint', 'dart-sass', 'postcss', 'babel']
      },
      build: {
        files: [
          'assets/**/*.js',
          'assets/**/*.scss',
          'htdocs/**/*'
        ],
        tasks: ['copy', 'jshint', 'stylelint', 'dart-sass', 'postcss', 'babel']
      }
    }
  });

  // Automatically load all grunt task dependencies
  require('load-grunt-tasks')(grunt);

  // Default task
  grunt.registerTask('default', ['copy', 'jshint', 'stylelint', 'dart-sass', 'babel']);

};
