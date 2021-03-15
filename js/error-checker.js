/**
 * Python code error checker using TPyParser (TigerPython parser).
 */
'use strict';

/**
 * @returns An object with the error checker wrapper.
 */
var ErrorChecker = function() {
    TPyParser.pythonVersion = 3;
    TPyParser.rejectDeadCode = true;
    TPyParser.strictCode = true;

    function parseCode(code) {
        var parsedErrors = TPyParser.findAllErrors(code);
        return parsedErrors.map(function(error) {
            return {
                line_start: error.line,
                column_start: error.offset,
                line_end: error.line,
                column_end: null,
                message: error.msg,
            };
        });
    }

    return {
        'parseCode': parseCode
    };
}

if (typeof module !== 'undefined' && module.exports) {
    global.ErrorChecker = ErrorChecker;
} else {
    window.ErrorChecker = ErrorChecker;
}
