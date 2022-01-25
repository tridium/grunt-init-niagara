/* eslint-env node */

'use strict';

/* eslint-env node */

const path = require('path');
const parseVersion = require('./parseVersion');

var superlatives = [
  'whimsical',
  'distinguished',
  'meritorious',
  'noteworthy',
  'magnificent',
  'superb',
  'splendid',
  'resplendent',
  'sublime',
  'renowned',
  'remarkable',
  'transcendent'
];

// Basic template description.
exports.description = "Create a new Niagara module";

// Template-specific notes to be displayed before question prompts.
exports.notes = "";

// warn if any files might be overwritten. build/ and node_modules/ are ok.
exports.warnOn = [
  '**/*',
  '!build/**',
  '!node_modules/**'
];

////////////////////////////////////////////////////////////////
// Utility functions
////////////////////////////////////////////////////////////////

//find the index of the prompt using the property name it provides
function findPromptIndexByName(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === name) {
      return i;
    }
  }
  return -1;
}

function capitalizeFirstLetter(s) {
  return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function isValidNiagaraModuleName(name) {
  return /^[A-Za-z][A-Za-z0-9_]*$/.test(name);
}

function isValidTypeSpec(name) {
  return /^[A-Za-z][A-Za-z0-9_]*:[A-Z][A-Za-z0-9]*$/.test(name);
}

//remove properties from an object where the property name satisfies the filter
function filterOutProps(obj, filter) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i) && filter(i)) {
      delete obj[i];
    }
  }
}

//return a random superlative
function superlative() {
  return superlatives.splice(Math.floor(Math.random() * superlatives.length), 1);
}

exports.template = function (grunt, init, done) {
  var niagaraModuleName,
      allPrompts,
      currentNiagaraVersion;
      
  /**
   * Insert the given prompts after the the prompt specified by name. They will
   * not be inserted if they already exist.
   *
   * @private
   * @inner
   * @param {String} name
   * @example
   * insertPromptAfter('prompt1', prompt2, prompt3, prompt4);
   */
  function insertPromptsAfter(name) {
    var prompts = Array.prototype.slice.call(arguments, 1),
        promptToInsert,
        idx = findPromptIndexByName(allPrompts, name);

    if (idx === -1) {
      throw new Error('name ' + name + ' not found');
    }

    while (prompts.length) {
      promptToInsert = prompts.splice(0, 1)[0]; //get first prompt
      if (allPrompts.indexOf(promptToInsert) === -1) {
        allPrompts.splice(++idx, 0, promptToInsert);
      }
    }
  }
  
////////////////////////////////////////////////////////////////
// Definitions of prompts
////////////////////////////////////////////////////////////////

  const widgetNamePrompt = {
    message: 'bajaux Widget name',
    name: 'widgetName',
    default: function (value, data, done) {
      done(null, capitalizeFirstLetter(niagaraModuleName) + 'Widget');
    },
    validator: function (value, done) {
      done(isValidNiagaraModuleName(value));
    },
    warning: 'Must be only letters, numbers, or underscores'
  };

  const formFactorPrompt = {
    message: 'bajaux form factor (mini/compact/max)',
    name: 'formFactor',
    default: 'mini',
    warning: 'This defines the desired form factor of your bajaux Widget. ' +
      'For a field editor, choose mini. For a fullscreen view, choose max.'
  };

  const classNamePrompt = {
    message: 'Fully qualified class name for your Widget',
    name: 'fullClassName',
    default: function (value, data, done) {
      var author = data['author_name'].replace(/[^A-Za-z0-9]/g, '')
        .toLowerCase();
      done(null, 'com.' + author + '.' + niagaraModuleName.toLowerCase() +
        '.B' + data.widgetName);
    },
    validator: function (value, done) {
      done(value.split('.').pop().charAt(0) === 'B');
    },
    warning: 'Class must be fully qualified and start with B'
  };

  /**
   * If you choose to register as an agent on a type, we will generate you a
   * Java class. This will add another prompt for the class name to use.
   */
  const registerAgentPrompt = {
    message: 'Register your Widget as an agent on a Type? (Leave blank for none)',
    name: 'agentType',
    validator: function (value, done) {
      if (value === '') {
        return done(true);
      }

      if (isValidTypeSpec(value)) {
        insertPromptsAfter('agentType', classNamePrompt);
        return done(true);
      }

      return done(false);
    },
    warning: 'Registering your Widget as an agent on a Type will mark it as an' +
      'editor for that Type. Must be a valid Niagara type spec such as ' +
      'baja:String.'
  };

  const niagaraModuleNamePrompt = {
    message: 'Niagara module name',
    name: 'name',
    default: function (value, data, done) {
      var name = path.basename(process.cwd())
        .replace(/-/g, '_')
        .replace(/[^A-Za-z0-9_]/g, '');
      done(null, name);
    },
    validator: function (value, done) {
      var valid = isValidNiagaraModuleName(value);
      if (valid) {
        niagaraModuleName = value;
      }
      done(valid);
    },
    warning: 'Must be only letters, numbers or underscores.'
  };

  const targetNiagaraVersionPrompt = {
    message: 'What Niagara version will you build your module against?',
    name: 'targetVersion',
    default: '4.10',
    validator: (value, done) => {
      currentNiagaraVersion = parseVersion(value);
      done(!!currentNiagaraVersion);
    },
    warning: 'Must be in major.minor format, e.g. "4.4".'
  };

  const preferredSymbolPrompt = {
    message: 'Shortened preferred symbol for your Niagara module',
    name: 'preferredSymbol',
    default: function (value, data, done) {
      var name = data.name;
      done(null, name.replace(/[aeiou]|[^A-Za-z0-9]/g, ''));
    },
    warning: 'Must be unique'
  };

  /**
   * Decide if you want template files fleshed out with demo logic, or barebones
   */
  const skeletonPrompt = {
    message: 'Only generate skeleton files?',
    name: 'skeleton',
    default: 'y/N',
    validator: function (value, done) {
      if (value.toLowerCase() !== 'y' && currentNiagaraVersion &&
        currentNiagaraVersion.compareTo('4.10') >= 0) {
        insertPromptsAfter('skeleton', jsxPrompt);
      }
      done();
    },
    warning: 'y: Your widget files will be the bare ' +
      'minimum structure of a bajaux widget. N: Your widget files will contain ' +
      'demo logic to examine and modify. If this is your first time using ' +
      'grunt-init-niagara or bajaux, choose N.'
  };

  /**
   * If you create a bajaux Widget, adds prompts for the name of the Widget and
   * whether you want to register it as an agent.
   */
  const bajauxPrompt = {
    message: 'Would you like to create a bajaux Widget?',
    name: 'bajaux',
    default: 'y/N',
    validator: function (value, done) {
      //this logic should be in before(), but grunt-init uses an old version of
      //the 'prompt' library
      if (value.toLowerCase() === 'y') {
        //we're creating a bajaux widget. prompt for a couple more bajaux things
        insertPromptsAfter('bajaux', widgetNamePrompt, formFactorPrompt,
          registerAgentPrompt, skeletonPrompt, lessPrompt);
      }
      done();
    }
  };

  const jsxPrompt = {
    message: 'Would you like to use JSX to create your Widget?',
    name: 'jsx',
    default: 'y/N',
    warning: 'New bajaux APIs in Niagara 4.10 allow the usage of JSX when ' +
      'creating your Widgets. These APIs are in _Development_ status. They are ' +
      'Niagara-specific and they are not the same thing as React. See the ' +
      'bajaux documentation for full details.'
  };

  const lessPrompt = {
    message: 'Would you like to use LESS to generate CSS?',
    name: 'less',
    default: 'y/N',
    warning: 'LESS is a style sheet language that can be compiled to CSS. Variables and ' +
      'mixins are some of the powerful features that make LESS more dynamic. More information ' +
      'about LESS and its features can be found here \'https://lesscss.org/\'.'
  };

  const authorPrompt = {
    message: 'Name of author or organization',
    name: 'author_name',
    default: process.env.USER || process.env.USERNAME || 'Me',
    warning: 'The author name will be used to generate copyright notices and ' +
      'the module\'s vendor name.'
  };

  allPrompts = [
    niagaraModuleNamePrompt,
    targetNiagaraVersionPrompt,
    preferredSymbolPrompt,
    { name: 'description', message: 'Description of your Niagara module' },
    authorPrompt,
    bajauxPrompt, //can add more prompts depending on answers
    init.prompt('version'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('author_email'),
    init.prompt('node_version', '>= 10.22.0'),
    init.prompt('npm_test', 'grunt ci')
  ];

////////////////////////////////////////////////////////////////
// Process user responses to prompts and copy in our files
////////////////////////////////////////////////////////////////

  init.process({}, allPrompts, function (err, props) {

    //is the file used for a bajaux widget?
    function isWidgetFile(file) {
      return file.indexOf('Widget') > 0;
    }

    //is the file used for agent registration of a bajaux widget?
    function isAgentFile(file) {
      return file.match('.java') || file.match('module-include.xml');
    }

    function isLessFile(file) {
      return file.match(props.name + '.less');
    }

    function isCssFile(file) {
      return file.match(props.name + '.css');
    }

    function isNonSkeleton(file) {
      return file.match('.htm') ||
        file.match('.css') ||
        file.match('.less') ||
        file.match(props.name + '\\.js$') ||
        file.match(props.name + 'Spec\\.js$') ||
        file.match('.hbs');
    }

    if (err) { throw err; }

    const targetVersion = parseVersion(props.targetVersion),
      v46OrLater = targetVersion.compareTo('4.6') >= 0,
      v49OrLater = targetVersion.compareTo('4.9') >= 0,
      v410OrLater = targetVersion.compareTo('4.10') >= 0,
      v411OrLater = targetVersion.compareTo('4.11') >= 0;

    //fix/tweak our properties (to be used by templates)
    props.keywords = [];
    props.year = new Date().getFullYear();
    props.devDependencies = {
      "grunt": "~1.0.1",
      "grunt-niagara": "^2.1.0",
      "@babel/core": "^7.0.0",
      "@babel/preset-env": "^7.0.0",
      "babel-plugin-istanbul": "^4.1.3"
    };

    if (props.jsx) {
      props.devDependencies['@babel/plugin-transform-react-jsx'] = '^7.10.0';
      props.devDependencies['eslint-plugin-react'] = '^7.20.0';
    } else {
      props.jsx = false;
    }

    if (props.less) {
      props.devDependencies['grunt-contrib-less'] = '^2.0.0';
    }

    props.isFirstParty = props.author_name.toLowerCase() === 'tridium';
    props.isThirdParty = !props.isFirstParty;
    props.gradleVersion = props.isThirdParty ? '4' : '5';
    props.gradleFile = props.name + '-ux.gradle';
    props.fe = String(props.formFactor).toLowerCase() === 'mini';
    props.widgetClass = props.fe ? 'BaseEditor' : 'Widget';
    props.widgetModule = props.fe ? 'nmodule/webEditors/rc/fe/baja/BaseEditor' : 'bajaux/Widget';
    switch (String(props.formFactor).toLowerCase()) {
      case 'mini': props.widgetInterface = 'BIFormFactorMini'; break;
      case 'compact': props.widgetInterface = 'BIFormFactorCompact'; break;
      case 'max': props.widgetInterface = 'BIFormFactorMax'; break;
    }

    props.fullClassName = props.fullClassName || '';

    var split = props.fullClassName.split('.');
    props.className = split.pop();
    props.package = split.join('.');
    props.superlative = superlative;
    props.bajaux = String(props.bajaux).toLowerCase() === 'y';
    props.less = String(props.less).toLowerCase() === 'y';
    props.skeleton = !props.bajaux || String(props.skeleton).toLowerCase() === 'y';
    props.moduleName = niagaraModuleName;
    props.jsBuildName = capitalizeFirstLetter(props.moduleName) + 'JsBuild';
    props.widgetName = props.widgetName === undefined ? 'NotAWidget' : props.widgetName;

    props.jqueryVersion = v411OrLater ? '' : (v49OrLater ? '-3.4.1' : '-3.2.0');
    props.handlebarsFilename = v49OrLater ? 'handlebars' : 'handlebars-v4.0.6';
    props.hasLogJs = v46OrLater;
    props.hasGruntPlugin = v46OrLater;
    props.supportsPluginsBlock = props.isFirstParty;
    props.supportsVendor = v46OrLater;
    props.newWidgetConstructor = v410OrLater;
    props.coreModulePlugin = props.isFirstParty && v49OrLater ? 'com.tridium.convention.core-module' : 'com.tridium.niagara-module';
    props.addJqueryShim = v411OrLater;

    var files = init.filesToCopy(props);

    if (props.less) {
      filterOutProps(files, function (file) {
        return isCssFile(file);
      });
    } else {
      filterOutProps(files, function (file) {
        return isLessFile(file);
      });
    }

    if (!props.bajaux) {
      //we're not making a bajaux widget, so don't copy any bajaux-specific files.
      filterOutProps(files, function (file) {
        return (isWidgetFile(file) || isAgentFile(file));
      });
    } else if (!props.agentType) {
      //we're making a widget but not registering it as an agent, so don't copy
      //Java class files etc.
      filterOutProps(files, isAgentFile);
    }

    if (props.bajaux && props.skeleton) {
      filterOutProps(files, isNonSkeleton);
    }

    init.copyAndProcess(files, props, {
      //processing a binary BOG file will destroy it
      noProcess: 'name-ux/srcTest/rc/stations/**'
    });

    init.writePackageJSON(props.name + '-ux/package.json', props);

    // Template-specific notes to be displayed after question prompts.
    exports.after =
      'You should now cd into your new ' + props.name + '-ux directory and ' +
      'install project dependencies with _npm install_. ' +
      'After that, you may execute project tasks with _grunt_. ' +
      'For more information about installing and configuring Grunt, please ' +
      'see the Getting Started guide:' +
      '\n\n' +
      'http://gruntjs.com/getting-started' +
      '\n\n' +
      'Build the Niagara module with Gradle by changing to your Niagara User ' +
      'Home and typing: ' +
      ('_gradlew :' + props.name + '-ux:build_');
      
    if (props.bajaux && !props.skeleton) {
      exports.after += '\n\n' +
      'If you like, you can start up a station and visit the following URL ' +
      'for a simple demo:' +
      '\n\n' +
      'http://localhost/module/' + props.name + '/rc/' + props.name + '.htm';
    }
    
    done();
  });
};
