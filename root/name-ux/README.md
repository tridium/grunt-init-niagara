# {%= name %}

A {%= superlative() %} Niagara module brought to you by {%= author_name %}.

#### {%= description %}

{% if (bajaux) { %}

```javascript
  require(['/nmodule/{%= name %}/rc/{%= widgetName %}'], function ({%= widgetName %}) {
    var widget = new {%= widgetName %}();
    widget.initialize($('#myWidgetGoesHere')).then(function () {
      return widget.load('my value');
    });
  });
```

{% } else { %}

```javascript
  require(['{%= name %}/{%= name %}'], function ({%= name %}) {
    {%= name %}.extolVirtues();
  });
```

{% } %}

## Building

This module builds with Gradle. The Gradle build will perform r.js optimization,
minification, and JSDoc generation. Just type: `gradlew :{%= name %}:build`

## Development

You can do development on this module with the help of Grunt. Just cd into
the module directory and type `grunt watch` to begin; JSHint and Karma tests
will be run on every file save. You can also type `grunt jshint:src` and
`grunt karma` just to run them once.

Just type `grunt` for a listing of all options.