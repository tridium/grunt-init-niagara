{% if (bajaux) { %}
define(['nmodule/{%= name %}Test/rc/spec/{%= widgetName %}Spec'], function () {
  'use strict';
});
{% } else { %}
define(['nmodule/{%= name %}Test/rc/spec/{%= name %}Spec'], function () {
  'use strict';
});
{% } %}


