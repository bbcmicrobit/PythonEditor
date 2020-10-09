/**
 * Test for filesystem wrapper
 */
'use strict';

describe('Testing the MicroPython API helper functions', function() {
    describe('Testing the MicroPython API helper functions', function() {
        it('Flattens an API object into an array', function() {
            var api = {
                'microbit': {
                    'Image': ['HEART'],
                    "pin5" : ["read_digital", "write_digital"],
                    "panic" : "",
                },
                "audio" : ["play", "AudioFrame"],
            }

            var result = microPythonApi.flattenApi(api);

            expect(result.sort()).toEqual([
                'microbit',
                'microbit.Image', 'microbit.Image.HEART', 'Image.HEART',
                'microbit.pin5', 'microbit.pin5.read_digital', 'microbit.pin5.write_digital', 'pin5.read_digital', 'pin5.write_digital',
                'microbit.panic', /*'panic',*/
                'audio',
                'audio.play',
                'audio.AudioFrame'
            ].sort())
        });
    });

    describe('Testing the Python import detection', function() {
        it('Basic "import microbit"', function() {
            var result1 = microPythonApi.detectImports('import microbit');
            var result2 = microPythonApi.detectImports('import microbit\n# Some code');
            var result3 = microPythonApi.detectImports('import   microbit  \n# Some code');
            var result4 = microPythonApi.detectImports('import\tmicrobit\t\n# Some code');
            var result5 = microPythonApi.detectImports('import  \t  microbit  \t  \n# Some code');

            expect(result1).toEqual({ 'microbit': { 'module-import': null } });
            expect(result2).toEqual({ 'microbit': { 'module-import': null } });
            expect(result3).toEqual({ 'microbit': { 'module-import': null } });
            expect(result4).toEqual({ 'microbit': { 'module-import': null } });
            expect(result5).toEqual({ 'microbit': { 'module-import': null } });
        });

        it('Basic "from microbit import *"', function() {
            var result1 = microPythonApi.detectImports('from microbit import *');
            var result2 = microPythonApi.detectImports('from microbit import *\n# Some code');
            var result3 = microPythonApi.detectImports('from   microbit   import *   \n# Some code');
            var result4 = microPythonApi.detectImports('from\tmicrobit\timport *\t\n# Some code');
            var result5 = microPythonApi.detectImports('from  \t  microbit  \t  import *  \t  \n# Some code');

            expect(result1).toEqual({ 'microbit': { '*': { 'module-import': null } } });
            expect(result2).toEqual({ 'microbit': { '*': { 'module-import': null } } });
            expect(result3).toEqual({ 'microbit': { '*': { 'module-import': null } } });
            expect(result4).toEqual({ 'microbit': { '*': { 'module-import': null } } });
            expect(result5).toEqual({ 'microbit': { '*': { 'module-import': null } } });
        });

        it('Comma separated "from x import y, z"', function() {
            var result1 = microPythonApi.detectImports('from microbit import display,Image,panic');
            var result2 = microPythonApi.detectImports('from microbit import display, Image, panic');
            var result3 = microPythonApi.detectImports('from   microbit  import   display,   Image,   panic  ');
            var result4 = microPythonApi.detectImports('from  \t  microbit  \t  import  \t  display,  \t  Image,  \t  panic  \t  ');
            var result5 = microPythonApi.detectImports('from  \t  microbit import  \t  display,Image, panic');

            var expected = {
                'microbit': {
                    'display': { 'module-import': null },
                    'Image':   { 'module-import': null },
                    'panic':   { 'module-import': null },
                }
            };
            expect(result1).toEqual(expected);
            expect(result2).toEqual(expected);
            expect(result3).toEqual(expected);
            expect(result4).toEqual(expected);
            expect(result5).toEqual(expected);
        });

        it('Import nested packages', function() {
            var pyCode = 'import top_package.inner_package.other_package.one_more_level';

            var result = microPythonApi.detectImports(pyCode);

            expect(result).toEqual({
                'top_package': {
                    'module-import': null,
                    'inner_package': {
                        'module-import': null,
                        'other_package': {
                            'module-import': null,
                            'one_more_level': {
                                'module-import': null
                            }
                        }
                    },
                }
            });
        });

        it('Import relative packages', function() {
            expect(microPythonApi.detectImports('from . import microbit')).toEqual({
                'microbit': { 'module-import': null }
            });

            expect(microPythonApi.detectImports('import .microbit')).toEqual({
                'microbit': { 'module-import': null }
            });

            expect(microPythonApi.detectImports('import .microbit.display')).toEqual({
                'microbit': {
                    'module-import': null,
                    'display': { 'module-import': null }
                }
            });

            expect(microPythonApi.detectImports('from .microbit.display import show')).toEqual({
                'microbit': {
                    'display': {
                        'show': { 'module-import': null },
                    }
                }
            });

            expect(microPythonApi.detectImports('from .microbit.display import show, scroll')).toEqual({
                'microbit': {
                    'display': {
                        'show': { 'module-import': null },
                        'scroll': { 'module-import': null },
                    }
                }
            });
        });

        it('Import with "as" aliases', function() {
            expect(microPythonApi.detectImports('from microbit import display as d, Image as i')).toEqual({
                'microbit': {
                    'display':  { 'module-import': null },
                    'Image': { 'module-import': null },
                },
            });

            expect(microPythonApi.detectImports('import microbit as d, audio as a')).toEqual({
                'microbit': { 'module-import': null, },
                'audio': {'module-import': null },
            });

            // This is not properly supported, because Python changes import behaviour based on the "as" expression
            // expect(microPythonApi.detectImports('import microbit.display as d')).toEqual({
            //     'microbit': { 'display': null, }
            // });
        });

        it('Most import methods combined in a single script', function() {
            var pyCode =
                'import microbit\n' +
                'from microbit import *\n' +
                'from microbit import display\n' +
                'from microbit import accelerometer as a, magnetometer as m\n' +
                'from microbit import display, temperature, panic\n' +
                'from .microbit.Image import HAPPY\n' +
                'import microbit.uart\n' +
                'import .microbit.i2c\n' +
                'import radio as r, music as m\n' +
                // Multi line not yet supported
                //'from microbit import (display,\n' +
                //'    Image,\n' +
                //'    panic\n' +
                //')\n' +
                'from . import audio';

            var result = microPythonApi.detectImports(pyCode);

            expect(result).toEqual({
                'microbit': {
                    'module-import': null,
                    '*': { 'module-import': null },
                    'display': { 'module-import': null },
                    'accelerometer': { 'module-import': null },
                    'magnetometer': { 'module-import': null },
                    'temperature': { 'module-import': null },
                    'panic': { 'module-import': null },
                    'Image': {
                        'HAPPY': { 'module-import': null },
                    },
                    'uart': { 'module-import': null },
                    'i2c':{ 'module-import': null },
                },
                'audio': {
                    'module-import': null,
                },
                'radio': {
                    'module-import': null,
                },
                'music': {
                    'module-import': null,
                }
            });
        });
    });

    describe('Detecting use of extra modules', function() {
        it('from extra import *', function() {
            var pyCode =
                'from microbit import *\n' +
                'from microbit import microphone';

            var result = microPythonApi.isApiUsedCompatible('9901', pyCode);

            expect(result).toBeFalsy();
        });

        it('from extra import *', function() {
            var pyCode =
                'from microbit import *\n' +
                'from microbit.microphone import *\n';

            var result = microPythonApi.isApiUsedCompatible('9901', pyCode);

            expect(result).toBeFalsy();
        });

        it('from extra.nested import something', function() {
            var pyCode =
                'from microbit import *\n' +
                'from microbit.microphone import LOUD\n';

            var result = microPythonApi.isApiUsedCompatible('9901', pyCode);

            expect(result).toBeFalsy();
        });

        it('Common modules are not detected as incompatible', function() {
            var pyCode =
                'import microbit\n' +
                'from microbit import *\n' +
                '# Code';

            var result = microPythonApi.isApiUsedCompatible('9901', pyCode);

            // TODO: This won't work until we fix the API compatibility feature
            //expect(result).toBeTruthy();
        });

        it('Naive check for no false positives', function() {
            var pyCode =
                'import microbit\n' +
                'from microbit import *\n' +
                'from microbit import display\n' +
                'from microbit import accelerometer as a, magnetometer as m\n' +
                'from microbit import display, temperature, panic\n' +
                'from .microbit.Image import HAPPY\n' +
                'import microbit.uart\n' +
                'import .microbit.i2c\n' +
                'import radio as r, music as m\n' +
                'from . import audio\n' +
                '# Code';

            var result = microPythonApi.isApiUsedCompatible('9901', pyCode);

            // TODO: This won't work until we fix the API compatibility feature
            //expect(result).toBeTruthy();
        });

    });
});
