/* eslint-disable camelcase */
/* eslint-env node */

'use strict';

const fs = require('fs'),
  { spawn } = require('child_process'),
  path = require('path'),
  Question = require('./Question'),
  multiProject = process.argv.indexOf('--multi') >= 0,
  niagara_dev_home = process.env.niagara_dev_home || '.',
  moduleDirIndex = process.argv.indexOf('--moduleDir'),
  moduleDir = moduleDirIndex >= 0 ? process.argv[moduleDirIndex + 1] : niagara_dev_home;

if (multiProject && !niagara_dev_home) {
  throw new Error('niagara_dev_home environment variable not set');
}


/**
 * Do the full suite of test inits and builds for all permutations of the
 * available grunt-init questions.
 *
 * @param {Function} cb to be called with an array of all question paths that
 * successfully built
 */
module.exports.testAllPaths = function testAllPaths(cb) {
  var firstQ = Question.questions.name,
      allPaths = firstQ.enumerateAllPaths(),
      success = [];

  (function nextRun(paths, cb) {
    if (!paths.length) { return cb(null, success); }

    var choices = paths.shift();
    testRun('testModule', choices, function (err) {
      if (err) { return cb(err, choices); }

      success.push(choices);
      nextRun(paths, cb);
    });
  }(allPaths.slice(), cb));
};







/**
 * Run the grunt-init process for the given module name and feed it the given
 * array of answers to its questions.
 *
 * @param {String} cwd
 * @param {Array.<String>} choices
 * @param {Function} cb
 */
function doGruntInit(cwd, choices, cb) {
  var p = exec('grunt-init', [ 'grunt-init-niagara' ], cwd, cb);

  setTimeout(function writeChoice() {
    if (!choices.length) {
      return p.stdin.write('N\n'); //done, no changes to my choices please
    }
    var choice = choices.shift();
    p.stdin.write(choice.value + '\n');
    console.log('choice: ' + choice.name + ' value: ' + choice.value);
    setTimeout(writeChoice, 200);
  }, 1000);
}

/**
 * Do the gradlew build for the given module.
 *
 * @param {String} moduleName
 * @param {Function} cb
 */
function doGradlewBuild(moduleName, cb) {
  var cwd = niagara_dev_home,
      buildCmd = ':' + moduleName + '-ux:build';
  // disable daemon, since we're wiping out the directory in between
  exec('gradlew', [ buildCmd, '-a', '--no-daemon', '--rerun-tasks' ], cwd, cb);
}

/**
 * Do all steps from grunt-init to gradlew for the given module.
 *
 * @param {String} moduleName
 * @param {Array.<String>} choices answers to feed to grunt-init
 * @param {Function} cb
 */
function testRun(moduleName, choices, cb) {
  const moduleHome = path.join(moduleDir, moduleName);
  if (fs.existsSync(moduleHome)) { deleteFolderRecursive(moduleHome); }
  fs.mkdirSync(moduleHome);
  doGruntInit(moduleHome, choices.slice(), function (err) {
    if (err) { return cb(err); }
    doGradlewBuild(moduleName, function (err) {
      if (err) { return cb(err); }
      gruntCi(path.join(moduleHome, moduleName + '-ux'), cb);
    });
  });
}

function gruntCi(cwd, cb) {

  if (multiProject) {
    return exec('grunt', [ 'ci' ], cwd, cb);
  }
  
  exec('yarn', [ 'install', '--pure-lockfile' ], cwd, function (err) {
    if (err) { return cb(err); }
    exec('grunt', [ 'ci' ], cwd, cb);
  });
}


/**
 * @param {String} cmd
 * @param {Array} args
 * @param {String} cwd
 * @param {Function} cb
 * @returns the spawned process
 */
function exec(cmd, args, cwd, cb) {
  var p = spawn(cmd, args, { cwd: cwd, stdio: 'pipe', shell: true });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
  p.on('error', function (err) {
    console.log('spawn error');
    console.error(err);
  });
  p.on('exit', function (code) {
    if (code === null) {
      cb(new Error('process "' + cmd + '" terminated abnormally'));
    } else if (code) {
      cb(new Error('process returned error code ' + code));
    } else {
      cb(null, code);
    }
  });

  return p;
}

/**
 * http://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
 * @param path
 */
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
