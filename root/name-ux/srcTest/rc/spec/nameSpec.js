define(['nmodule/{%= name %}/rc/{%= name %}'], function ({%= name %}) {
  'use strict';

  describe("{%= name %}", function () {
    it("can extol its own virtues", function () {
      expect({%= name %}.extolVirtues()).toBe('{%= name %} is great!');
    });
  });

});