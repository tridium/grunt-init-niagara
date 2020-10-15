/* eslint-env node */

'use strict';

/**
 * Test script for permuting all possible choices through the grunt-init
 * questions and verifying that the resulting Niagara module can successfully
 * build.
 *
 * Works On My Machine� - may need tweaking to work in different environments.
 * Also please note that this doesn't currently clean up the test Niagara
 * module it builds so you'll need to manually remove it.
 */

require('./util').testAllPaths(function (err, result) {
  if (err) {
    console.error('path ' + result.join() + ' failed:');
    console.error(err);
  } else {
    console.log('\n\nall paths completed successfully:');
    console.log(result.map(function (p) { return p.join(', '); }).join('\n'));
  }
});
