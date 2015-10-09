var fs = require('fs'),
    spawn = require('child_process').spawn,
    path = require('path'),
    Question = require('./Question'),
    multiProject = process.argv.indexOf('--multi') >= 0,
    niagara_dev_home = process.env.niagara_dev_home;

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
 * @param {String} moduleName
 * @param {Array.<String>} choices
 * @param {Function} cb
 */
function doGruntInit(moduleName, choices, cb) {
  var cwd = path.join(process.cwd(), moduleName);
  var p = exec('grunt-init', ['grunt-init-niagara'], cwd, cb);

  setTimeout(function writeChoice() {
    if (!choices.length) {
      return p.stdin.write('N\n'); //done, no changes to my choices please
    }
    var choice = choices.shift();
    p.stdin.write(choice + '\n');
    setTimeout(writeChoice, 100);
  }, 1000);
}

/**
 * Do the gradlew build for the given module.
 *
 * @param {String} moduleName
 * @param {Function} cb
 */
function doGradlewBuild(moduleName, cb) {
  var cwd = multiProject ? niagara_dev_home : path.join(process.cwd(), moduleName, moduleName + '-ux'),
      buildCmd = multiProject ? ':' + moduleName + '-ux:build' : 'build';
  // disable daemon, since we're wiping out the directory in between
  exec('gradlew', [buildCmd, '-a', '--no-daemon'], cwd, cb);
}

/**
 * Do all steps from grunt-init to gradlew for the given module.
 *
 * @param {String} moduleName
 * @param {Array.<String>} choices answers to feed to grunt-init
 * @param {Function} cb
 */
function testRun(moduleName, choices, cb) {
  if (fs.existsSync(moduleName)) { deleteFolderRecursive(moduleName); }
  fs.mkdirSync(moduleName);
  doGruntInit(moduleName, choices.slice(), function (err) {
    return err ? cb(err) : doGradlewBuild(moduleName, cb);
  });
}


/**
 * Exec a command - child_process.spawn does not support 'grunt-init' since it's
 * not an exe, but we can't use child_process.exec because we need to write to
 * its stdin. So: hackity hack
 * https://github.com/nodejs/node-v0.x-archive/issues/2318#issuecomment-3220048
 *
 * @param {String} cmd
 * @param {Array} args
 * @param {String} cwd
 * @param {Function} cb
 * @returns the spawned process
 */
function exec(cmd, args, cwd, cb) {
  var p = spawn('cmd', ['/s', '/c', cmd].concat(args), { cwd: cwd, stdio: 'pipe' });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
  p.on('error', function (err) {
    console.log('spawn error');
    console.error(err);
  });
  p.on('exit', function (code) {
    if (code === null) {
      cb('process "' + cmd + '" terminated abnormally');
    } else if (code) {
      cb('process returned error code ' + code);
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
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
