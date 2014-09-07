{%

////////////////////////////////////////////////////////////////
// Non-skeleton, full-fat demo code
////////////////////////////////////////////////////////////////
  if (!skeleton) {

%}
require(['baja!',
         'nmodule/{%= name %}/rc/{%= name %}',
         'jquery',
         'nmodule/{%= name %}/rc/{%= viewName %}',
         'hbs!nmodule/{%= name %}/rc/template/{%= name %}'], function (
         baja,
         {%= name %},
         $,
         {%= viewName %},
         template) {

  'use strict';

  $("#template").html(template({
    virtues: {%= name %}.extolVirtues()
  }));

  var view = new {%= viewName %}(),
      comp = baja.$('baja:Component', {
        '{%= superlative() %}': true,
        '{%= superlative() %}': true,
        '{%= superlative() %}': true,
        '{%= superlative() %}': true,
        '{%= superlative() %}': true
      });

  var viewDiv = $('#view'),
      description = $('#description');

  view.initialize(viewDiv)
    .then(function () {

      viewDiv.on('click', function () {
        view.read()
          .then(function (value) {
            description.text(value);
          });
      });

      return view.load(comp);
    });
});
{%


////////////////////////////////////////////////////////////////
// Pared-down skeleton code
////////////////////////////////////////////////////////////////
} else if (bajaux) {


%}
require(['nmodule/{%= name %}/rc/{%= viewName %}'], function ({%= viewName %}) {
  'use strict';
});
{% 


////////////////////////////////////////////////////////////////
// No bajaux view
////////////////////////////////////////////////////////////////
} else { 


%}
require(['nmodule/{%= name %}/rc/{%= name %}'], function ({%= name %}) {
  'use strict';
});
{%

}

%}
