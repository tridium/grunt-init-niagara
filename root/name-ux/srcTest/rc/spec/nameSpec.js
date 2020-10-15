define([ 'nmodule/{%= name %}/rc/{%= name %}' ], function ({%= name %}) {
  'use strict';

  describe("nmodule/{%= name %}/rc/{%= name %}", () => {
    it("can extol its own virtues", () => {
      expect({%= name %}.extolVirtues()).toBe('{%= name %} is great!');
    });
  });
});
