/* jshint node: true *//* eslint-env node */

"use strict";

const loadTasksRelative = require('grunt-niagara/lib/loadTasksRelative');

const SRC_FILES = [
  'src/rc/**/*.js',
  'Gruntfile.js',
  '!**/*.built.js',
  '!**/*.built.min.js'
];
const TEST_FILES = [
  'srcTest/rc/**/*.js'
];
const JS_FILES = SRC_FILES.concat(TEST_FILES);
const ALL_FILES = JS_FILES.concat('src/rc/**/*.{% if (less) { %}less{% } else {%}css{%} %}');

module.exports = function runGrunt(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsdoc: {
      src: SRC_FILES.concat([ 'README.md' ])
    },
    eslint: {
      src: JS_FILES{% if (jsx) { %},
      options: {
        plugins: [ 'react' ]
      }{% } %}
    },
    babel: {
      options: {
        presets: [ '@babel/preset-env' ]{% if (jsx) { %},
        plugins: [ '@babel/plugin-transform-react-jsx' ]{% } %}
      }{% if (jsx) { %},
      coverage: {
        options: {
          plugins: [ '@babel/plugin-transform-react-jsx', 'istanbul' ]
        }
      }{% } %}
    },
    watch: {
      src: ALL_FILES{% if (less) { %},
      tasks: (tasks) => [ 'less' ].concat(tasks)
      {% } %}
    },{% if (less) { %}
    less: {
      options: {
        banner: '/* @noSnoop */',
        sourceMap: true,
        sourceMapBasepath: 'src',
        sourceMapRootpath: '/module/{%= name %}/'
      },
      {%= name %}: {
        options: {
          sourceMapFilename: 'build/src/maps/{%= name %}.map',
          sourceMapURL: '/module/{%= name %}/maps/{%= name %}.map'
        },
        files: {
          'build/src/rc/{%= name %}.css': 'src/rc/{%= name %}.less',
          'build/karma/src/rc/{%= name %}.css': 'src/rc/{%= name %}.less'
        }
      }
    },{% } %}
    karma: {},
    requirejs: {},
    niagara: {
      station: {
        stationName: '{%= name %}',
        forceCopy: true,
        sourceStationFolder: './srcTest/rc/stations/{%= name %}UnitTest'
      }
    }
  });

  loadTasksRelative(grunt, 'grunt-niagara');{% if (less) { %}
  loadTasksRelative(grunt, 'grunt-contrib-less');
    {% } %}
};
