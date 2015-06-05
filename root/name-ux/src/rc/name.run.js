{%

////////////////////////////////////////////////////////////////
// Non-skeleton, full-fat demo code
////////////////////////////////////////////////////////////////
  if (!skeleton) {

%}
require(['baja!',
         'bajaux/events',
         'nmodule/{%= name %}/rc/{%= name %}',
         'jquery',
         'nmodule/{%= name %}/rc/{%= widgetName %}',
         'hbs!nmodule/{%= name %}/rc/template/{%= name %}'], function (
         baja,
         events,
         {%= name %},
         $,
         {%= widgetName %},
         template) {

  'use strict';

  $("#template").html(template({
    virtues: {%= name %}.extolVirtues()
  }));

  var widget = new {%= widgetName %}(),
      comp = baja.$('baja:Component', {
        '{%= superlative() %}': true,
        '{%= superlative() %}': true,
        '{%= superlative() %}': true,
        '{%= superlative() %}': true,
        '{%= superlative() %}': true
      });

  var widgetDiv = $('#widget'),
      description = $('#description');

  widget.initialize(widgetDiv)
    .then(function () {

      widgetDiv.on(events.MODIFY_EVENT, function () {
        widget.read()
          .then(function (value) {
            description.text(value);
          });
      });

      return widget.load(comp);
    });
});
{%


////////////////////////////////////////////////////////////////
// Pared-down skeleton code
////////////////////////////////////////////////////////////////
} else if (bajaux) {


%}
require(['nmodule/{%= name %}/rc/{%= widgetName %}'], function ({%= widgetName %}) {
  'use strict';
});
{% 


////////////////////////////////////////////////////////////////
// No bajaux widget
////////////////////////////////////////////////////////////////
} else { 


%}
require(['nmodule/{%= name %}/rc/{%= name %}'], function ({%= name %}) {
  'use strict';
});
{%

}

%}
