define([], function () {
  'use strict';

  /**
   * Yarr 'tis a module
   *
   * @exports nmodule/{%= name %}/rc/{%= name %}
   */
  var {%= name %} = {};

  /**
   * Extol the virtues of {%= name %}.
   *
   * @returns {string}
   */
  {%= name %}.extolVirtues = function () {
    return '{%= name %} is great!';
  };

  return {%= name %};
});
