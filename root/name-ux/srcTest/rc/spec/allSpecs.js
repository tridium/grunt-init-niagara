{% if (bajaux) { %}
define([
  'nmodule/js/rc/jasmine/promiseUtils',
  'nmodule/{%= name %}Test/rc/spec/{%= widgetName %}Spec' ], function (
  promiseUtils) {
  'use strict';
  beforeEach(function () {
    promiseUtils.addCustomMatchers(this);
  });
});
{% } else { %}
define([
  'nmodule/js/rc/jasmine/promiseUtils',
  'nmodule/{%= name %}Test/rc/spec/{%= name %}Spec' ], function (
  promiseUtils) {
  'use strict';
  beforeEach(function () {
    promiseUtils.addCustomMatchers(this);
  });
});
{% } %}


