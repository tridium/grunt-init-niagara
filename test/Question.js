var multiProject = process.argv.indexOf('--multi') >= 0,
  version = process.argv[process.argv.indexOf('--version') + 1] || '4.6';

/**
 * Represents one question that may be answered during the grunt-init process.
 *
 * @param {String} name question name
 * @param {Object} choices possible responses to this question that we want to
 * test. Keys are the user-entered values to test; values are the names of the
 * questions that those values lead to.
 * @constructor
 */
function Question(name, choices) {
  this.name = name;
  this.c = choices;
}

/**
 * @returns {Array.<String>} all user responses to this question that we want
 * to test
 */
Question.prototype.choices = function () {
  return Object.keys(this.c);
};

/**
 * When the user enters this particular choice, which question comes next?
 *
 * @param {String} choice the value the user entered
 * @returns {Question|undefined} the next question for this choice, or undefined
 * if no more questions
 */
Question.prototype.next = function (choice) {
  return Question.questions[this.c[choice]];
};

/**
 * Enumerate all paths through the grunt-init questions following this one.
 *
 * @returns {Array.<Array.<String>>} an array of arrays; each array is of a set
 * of string responses that takes us through one functionally distinct path
 * through the grunt-init questions.
 */
Question.prototype.enumerateAllPaths = function enumerateAllPaths(allPaths, stack) {
  if (!arguments.length) { allPaths = []; stack = []; }

  var that = this,
      choices = that.choices() || [];

  choices.forEach(function (choice) {
    stack.push(choice);
    var next = that.next(choice);
    if (next) {
      next.enumerateAllPaths(allPaths, stack);
    } else { //final question
      allPaths.push(stack.slice());
    }
    stack.pop();
  });

  return allPaths;
};


/**
 * a mapping of Question objects that matches the order given by grunt-init and
 * the available choices we want to test, as listed below. asterisks are
 * the functional inflection points (different module configurations for
 * different answers). indented questions are only shown if the previous
 * question was answered a certain way.
 *
 *  name
 *  target version
 *  symbol
 *  description
 *  * author (internal?)
 *  * widget? if y:
 *    widget name
 *    * form factor
 *    * agent? if given:
 *      class name
 *    * skeleton
 *  version
 *  project homepage
 *  issues tracker
 *  email
 *  node versions
 *  test command
 */
Question.questions = {
  'name': new Question('name', { 'testModule': 'targetVersion' }),
  'targetVersion': new Question('targetVersion', { [version]: 'symbol' }),
  'symbol': new Question('symbol', { 'tstMdl': 'description' }),
  'description': new Question('description', { 'test module description': 'author' }),
  'author': new Question('author', (function () {
    var choices = {};
    choices[multiProject ? 'tridium' : 'myCompany'] = 'widget';
    return choices;
  }())),
  'widget': new Question('widget', { y: 'widget name', n: 'version' }),
  'widget name': new Question('widget name', { 'TestWidget': 'form factor' }),
  'form factor': new Question('form factor', { mini: 'agent', max: 'agent' }),
  'agent': new Question('agent', { 'baja:Component': 'class name', '': 'skeleton' }),
  'class name': new Question('class name', { 'com.testmodule.BTestWidget': 'skeleton' }),
  'skeleton': new Question('skeleton', { y: 'version', n: 'version' }),
  'version': new Question('version', { '0.1.0': 'project homepage' }),
  'project homepage': new Question('project homepage', { 'http://me.com': 'issues tracker' }),
  'issues tracker': new Question('issues tracker', { 'http://me.com/issues': 'email' }),
  'email': new Question('email', { 'me@me.com': 'node versions' }),
  'node versions': new Question('node versions', { '>= 0.8.0': 'test command' }),
  'test command': new Question('test command', { 'grunt ci': null })
};

module.exports = Question;