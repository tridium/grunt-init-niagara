/* jshint node: true *//* eslint-env node */

"use strict";

var loadTasksRelative = require('grunt-niagara/lib/loadTasksRelative');

const SRC_FILES = [
  'src/rc/**/*.js',
  'Gruntfile.js'
];
const TEST_FILES = [
  'srcTest/rc/**/*.js'
];
const JS_FILES = SRC_FILES.concat(TEST_FILES);
const ALL_FILES = JS_FILES.concat('src/rc/**/*.css');

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
      src: ALL_FILES
    },
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

  loadTasksRelative(grunt, 'grunt-niagara');
};
