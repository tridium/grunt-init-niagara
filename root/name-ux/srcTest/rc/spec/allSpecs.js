{% if (bajaux) { %}
define(['nmodule/{%= name %}Test/rc/spec/{%= viewName %}Spec'], function () {
  'use strict';
});
{% } else { %}
define(['nmodule/{%= name %}Test/rc/spec/{%= name %}Spec'], function () {
  'use strict';
});
{% } %}


