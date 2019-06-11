// Hook for pre-test initialization.
// See https://jestjs.io/docs/en/configuration.html#setupfiles-array

// Import ACE
require('../ace/ace.js');
global.ace.config.set('basePath', '/ace');
global.ace.edit = window.ace.edit;
global.ace.require = window.ace.require;
require("../ace/theme-kr_theme_legacy.js");
require("../ace/mode-python_microbit");
require("../ace/snippets/python_microbit.js");
require('../ace/ext-language_tools.js');

// Import the rest of the static libraries
global.$ = global.jQuery = require('../static/js/jquery-2.1.4.min.js');
global.MemoryMap = require('../static/js/intel-hex.browser.js');
// Had issues running the forge version included in the editor repo
global.forge = require('node-forge');

// Import our source code under test
require('../hexlify.js');
require('../python-main.js');

global.puppeteer = require('puppeteer');