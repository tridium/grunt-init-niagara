/* eslint-env browser */
/*global testGlobals */

(function () {
  
  'use strict';
  
  require.config({
    baseUrl: '/base',
    hbs: {
      disableI18n: true
    },
    paths: {
      baja: '/module/bajaScript/rc/plugin/baja',
      bajaScript: '/module/bajaScript/rc',
      bajaux: '/module/bajaux/rc',
      css: '/module/js/com/tridium/js/ext/require/css',
      Handlebars: '/module/js/rc/handlebars/{%= handlebarsFilename %}',
      hbs: '/module/js/rc/require-handlebars-plugin/hbs.built.min',
      jquery: '/module/js/rc/jquery/jquery{%= jqueryVersion %}.min',
      lex: '/module/js/rc/lex/lexplugin',{% if (hasLogJs) { %}
      log: '/module/js/rc/log/logPlugin',{% } %}
      nmodule: '/module',
      'nmodule/{%= name %}': 'build/karma/src',
      'nmodule/{%= name %}Test': 'build/karma/srcTest',
      Promise: '/module/js/rc/bluebird/bluebird.min',
      'niagara-test-server': '/niagara-test-server',
      underscore: '/module/js/rc/underscore/underscore'
    }{% if (addJqueryShim) { %},
    // This map config may be removed if all code is compatible with jQuery 3.5 strict mode.
    // For more details, visit https://jquery.com/upgrade-guide/3.5/. 
    map: {
      '*': {
        'jquery': 'nmodule/js/rc/shims/jquery/jquery'
      },
      'nmodule/js/rc/shims/jquery/jquery': {
        'jquery': 'jquery'
      }
    } {% } %}
  });
  
  function testOnly(regex) {
    if (regex) {
      testGlobals.testOnly = regex;
    }
  }

  require([ 'niagara-test-server/karmaUtils',
           'niagara-test-server/globals' ], function (karmaUtils) {

    /*
     * if your test suite grows very large, you can change which specs
     * are run here, without having to restart Karma with a different
     * --testOnly flag. just be sure not to commit this change.
     */
    //testOnly('rc/{%= name %}');
    testOnly('');

    karmaUtils.setupAndRunSpecs({
      user: 'admin',
      pass: 'asdf1234',
      specs: [ 'nmodule/{%= name %}Test/rc/spec/allSpecs' ]
    }, function (err) {
      if (err) { console.error(err); }
    });
  });
}());
