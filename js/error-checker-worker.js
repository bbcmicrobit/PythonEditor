/**
 * Web worker for the Python code error checker.
 */
'use strict';

importScripts('../static/js/tigerpython-parser.js');

function parseCode(code) {
    // var t0 = performance.now()
    const parsedErrors = TPyParser.findAllErrors(code);
    // console.log('parsing time: ', performance.now() - t0);
    postMessage({
        type: 'checker_errors',
        data: parsedErrors,
    });
}

function configureParser(parserConfig) {
    Object.keys(parserConfig).forEach(function(key) {
        TPyParser[key] = parserConfig[key];
    });
    console.log('Code Checker web worker configured.');
}

onmessage = function(evt) {
    if (evt.data.type === 'checker_config') {
        // Receiving parse configuration data
        configureParser(evt.data.data);
    } else if (evt.data.type === 'checker_code') {
        // Receiving code to analyse
        // console.log('code received');
        parseCode(evt.data.data);
    }
}
