// Hook for pre-test initialization.
// See https://jestjs.io/docs/en/configuration.html#setupfiles-array

// Import ACE
require('../ace/ace.js');
global.ace.edit = window.ace.edit;
global.ace.require = window.ace.require;
require("../ace/theme-kr_theme.js");
require("../ace/mode-python");
require("../ace/snippets/python.js");
require('../ace/ext-language_tools.js');

// Import the rest of the static libraries
global.$ = global.jQuery = require('../static/js/jquery-2.1.4.min.js');
global.MemoryMap = require('../static/js/intel-hex.browser.js');
// Had issues running the forge version included in the editor repo
global.forge = require('node-forge');

// Import our source code under test
require('../hexlify.js');
require('../python-main.js');

// Import Puppeteer tests
global.InvalidTest = require('./puppeteer/InvalidTest');
global.OldTestA = require('./puppeteer/OldTestA');
global.OldTestB = require('./puppeteer/OldTestB');
global.URLTest = require('./puppeteer/URLTest');

global.usbutils = require('./src/WebUSB');

var http = require('http');

var nStatic = require('node-static');

fileServer = new nStatic.Server('../');

global.localServer = http.createServer(function (req, res) {
    fileServer.serve(req, res);
}).listen(5000);
