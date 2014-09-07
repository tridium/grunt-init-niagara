# grunt-init-niagara

Initializes a new Niagara module with an eye towards Javascript and web
development.

For information on using grunt-init, see
[the Grunt documentation](http://gruntjs.com/project-scaffolding).

The new project will be configured to perform linting and unit testing using
JSHint and Karma, respectively, with unit tests provided by Jasmine.
A preconfigured station will be provided for testing purposes - if your
library does not need a station to communicate with, just remove the station
config from the Gruntfile.

Module loading will be provided by RequireJS.

A .gradle file will be provided that will handle r.js optimization and JSDoc
generations.