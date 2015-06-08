/*jshint devel: true */
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
      Handlebars: '/module/js/rc/handlebars/handlebars-v2.0.0',
      hbs: '/module/js/rc/require-handlebars-plugin/hbs.built',
      jquery: '/module/js/rc/jquery/jquery-1.8.2.min',
      lex: '/module/js/rc/lex/lexplugin',
      nmodule: '/module',
      'nmodule/{%= name %}': 'src',
      Promise: '/module/js/rc/bluebird/bluebird',
      'niagara-test-server': '/niagara-test-server',
      underscore: '/module/js/rc/underscore/underscore'
    }
  });
  
  function testOnly(regex) {
    if (regex) {
      testGlobals.testOnly = regex;
    }
  }

  require(['niagara-test-server/karmaUtils',
           'niagara-test-server/globals'], function (karmaUtils) {

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
      specs: ['srcTest/rc/spec/allSpecs']
    }, function (err) {
      if (err) { console.error(err); }
    });
  });
}());