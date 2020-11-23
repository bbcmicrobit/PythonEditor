/**
 * Test for filesystem wrapper
 */
'use strict';

/**
 *  Slim down hexes to mock Micropython, only containing the UICR and the
 *  MicroPython version string.
 */
var intelHexLines = [
    ':020000040003F7',
    ':106D200000000025713D00312E302E31006D696369',
    ':106D3000726F3A6269742076312E302E312B6230B8',
    ':106D40006266346139206F6E20323031382D313235',
    ':106D50002D31333B204D6963726F507974686F6ECB',
    ':106D60002076312E392E322D33342D67643634316E',
    ':106D70003534633733206F6E20323031372D303960',
    ':106D80002D3031006D6963726F3A626974207769E2',
    // Injected code goes here
    ':020000041000EA',
    ':1010C0007CB0EE17FFFFFFFF0A0000000000E30006',
    ':0C10D000FFFFFFFF2D6D0300000000007B',
    ':0400000500018E2147',
    ':00000001FF\n'
];
var intelHexFileInjectionIndex = 8;
var microPyIntelHex = intelHexLines.join('\n');

var universalHexLines = [
    ':020000040003F7',
    ':0400000A9900C0DEBB',
    ':106D200000000025713D00312E302E31006D696369',
    ':106D3000726F3A6269742076312E302E312B6230B8',
    ':106D40006266346139206F6E20323031382D313235',
    ':106D50002D31333B204D6963726F507974686F6ECB',
    ':106D60002076312E392E322D33342D67643634316E',
    ':106D70003534633733206F6E20323031372D303960',
    ':106D80002D3031006D6963726F3A626974207769E2',
    ':020000041000EA',
    ':1010C0007CB0EE17FFFFFFFF0A0000000000E30006',
    ':0C10D000FFFFFFFF2D6D0300000000007B',
    ':0400000500018E2147',
    ':0E00000CFFFFFFFFFFFFFFFFFFFFFFFFFFFFF4',
    ':0000000BF5',
    // Injected code goes here
    ':00000001FF\n',
];
var universalHexFileInjectionIndex = 15;

function intelHexWithInjectedFileRecords(fileRecords) {
    return intelHexLines.slice(0, intelHexFileInjectionIndex)
        .concat(fileRecords)
        .concat(intelHexLines.slice(intelHexFileInjectionIndex))
        .join('\n');
}

function universalHexWithInjectedFileRecords(fileRecords) {
    return universalHexLines.slice(0, universalHexFileInjectionIndex)
        .concat(fileRecords)
        .concat(universalHexLines.slice(universalHexFileInjectionIndex))
        .join('\n');
}

function runningJest() {
    return typeof jest !== 'undefined';
}

describe('Testing the filesystem wrapper', function() {
    beforeEach(function() {
        // Mock on Jest, let the files be fetch on Jasmine
        if (runningJest()) {
            $.get = jest.fn(function(fileUrl, callback) {
                callback(microPyIntelHex);
                return {
                    fail: function () {;}
                };
            });
        }
    });

    it('Initialises correctly', function(done) {
        var FS = microbitFsWrapper();
        expect(FS.write).toBeFalsy();

        FS.setupFilesystem().then(function() {
            // After initialising the filesystem it duplicates the microbitFs
            // methods into the FS wrapper, so write() didn't exits before.
            expect(FS.write).toBeTruthy();
            expect(FS.thisFuncDoesNotExist).toBeFalsy();
            var testCode = "Just a string";
            FS.write('main.py', testCode);
            expect(FS.read('main.py')).toBe(testCode);
            done();
        });
    });

    it('Produces a Byte Array for a single board', function(done) {
        var FS = microbitFsWrapper();
        expect(FS.write).toBeFalsy();

        FS.setupFilesystem().then(function() {

            var result = FS.getBytesForBoardId('9900');

            expect(result.constructor).toBe(Uint8Array);
            done();
        });
    });

    it('Unkown board ID to produces a Byte Array throws error', function(done) {
        var FS = microbitFsWrapper();
        expect(FS.write).toBeFalsy();

        FS.setupFilesystem().then(function() {

            var throwsError = function() {
                var result = FS.getBytesForBoardId('0000');
            }

            expect(throwsError).toThrow(new Error('Could not recognise the Board ID 0000'));
            done();
        });
    });

    describe('Testing importing filesystem files from a hex', function() {
        it('Imports files from an Intel Hex', function(done) {
            var hexMainPyFile = [
                ':020000040003F7',
                ':108C0000FE3A076D61696E2E70792320436F6465AB',
                ':108C10002066726F6D2061207468696E20686578C7',
                ':108C20002066696C6520696E204D6963726F5079AA',
                ':108C300074686F6E2076312E302E31FFFFFFFFFFFC',
                ':01F80000FD0A'
            ];
            var thinHexWithFile = intelHexWithInjectedFileRecords(hexMainPyFile);
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {
                expect(FS.ls().length).toBe(0);
                FS.write('shouldBeDeleted1.py', 'Importing deletes previous files');
                FS.write('main.py', 'So this file should be overwritten');
                expect(FS.ls().length).toBe(2);

                FS.importHexFiles(thinHexWithFile);

                expect(FS.ls().length).toBe(1);
                expect(FS.read('main.py')).toBe('# Code from a thin hex file in MicroPython v1.0.1');
                done();
            });
        });

        it('Imports files from a Universal Hex', function(done) {
            var hexMainPyFile = [
                ':020000040003F7',
                ':0400000A9900C0DEBB',
                ':108C0000FE3F076D61696E2E70792320436F6465A6',
                ':108C10002066726F6D206120756E69766572736172',
                ':108C20006C206865782066696C6520696E204D69E6',
                ':108C300063726F507974686F6E2076312E302E31EA',
                ':01F80000FD0A',
                ':0000000BF5'
            ];
            var universalHexWithFile = universalHexWithInjectedFileRecords(hexMainPyFile);
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {
                expect(FS.ls().length).toBe(0);
                FS.write('shouldBeDeleted1.py', 'Importing deletes previous files');
                FS.write('main.py', 'So this file should be overwritten');
                expect(FS.ls().length).toBe(2);

                FS.importHexFiles(universalHexWithFile);

                expect(FS.ls().length).toBe(1);
                expect(FS.read('main.py')).toBe('# Code from a universal hex file in MicroPython v1.0.1');
                done();
            });
        });

        it('Throws an error if files in Universal Hex are for other board', function(done) {
            // TODO: Reenable this tests if implemented in microbit-fs
            var hexMainPyFile = [
                ':020000040003F7',
                ':0400000A0000C0DE54',  // boardId 0x0000
                ':106D200000000025713D00312E302E31006D696369',
                ':106D3000726F3A6269742076312E302E312B6230B8',
                ':106D40006266346139206F6E20323031382D313235',
                ':106D50002D31333B204D6963726F507974686F6ECB',
                ':106D60002076312E392E322D33342D67643634316E',
                ':106D70003534633733206F6E20323031372D303960',
                ':106D80002D3031006D6963726F3A626974207769E2',
                ':020000041000EA',
                ':1010C0007CB0EE17FFFFFFFF0A0000000000E30006',
                ':0C10D000FFFFFFFF2D6D0300000000007B',
                ':0400000500018E2147',
                ':0E00000CFFFFFFFFFFFFFFFFFFFFFFFFFFFFF4',
                ':0000000BF5',
                ':020000040003F7',
                ':0400000A0000C0DE54',  // boardId 0x0000
                ':108C0000FE3F076D61696E2E70792320436F6465A6',
                ':108C10002066726F6D206120756E69766572736172',
                ':108C20006C206865782066696C6520696E204D69E6',
                ':108C300063726F507974686F6E2076312E302E31EA',
                ':01F80000FD0A',
                ':0000000BF5',
                ':00000001FF\n',
            ].join('\n');
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {

                var throwsError = function() {
                    FS.importHexFiles(hexMainPyFile);
                };

                //expect(throwsError).toThrow(new Error('Universal Hex does not contain data for the supported boards.'));
                done();
            });
        });

        it('Imports files from an appended script hex', function(done) {
            var appendedRecords = [
                ':020000040003F7',
                ':10E000004D501D0023205468697320697320746883',
                ':10E010006520617070656E646564207363726970F9',
                ':10E02000740000000000000000000000000000007C',
            ];
            var appendedHexWithFile = intelHexWithInjectedFileRecords(appendedRecords);
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {
                expect(FS.ls().length).toBe(0);
                FS.write('shouldBeDeleted1.py', 'Importing deletes previous files');
                FS.write('main.py', 'So this file should be overwritten');
                expect(FS.ls().length).toBe(2);

                FS.importHexAppended(appendedHexWithFile);

                expect(FS.ls().length).toBe(1);
                expect(FS.read('main.py')).toBe('# This is the appended script');
                done();
            });
        });

        it('Empty string throws an error about parsing the hex', function(done) {
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {
                FS.write('shouldNotBeDeleted.py', 'An error importing should keep files');

                var throwsError = function() {
                    FS.importHexFiles('');
                }

                expect(throwsError).toThrow(new Error(
                    'Malformed .hex file, could not parse any registers'));
                expect(FS.read('shouldNotBeDeleted.py')).toBe('An error importing should keep files');
                done();
            });
        });

        it('Empty Intel Hex throw an error about UICR', function(done) {
            var almostEmptyHex = [':020000040003F7',
            ':106D200000000025713D00312E302E31006D696369',
            ':00000001FF\n'].join('\n');
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {
                FS.write('shouldNotBeDeleted.py', 'An error importing should keep files');

                var throwsError = function() {
                    FS.importHexFiles(almostEmptyHex);
                }

                expect(throwsError).toThrow(new Error(
                    'Could not find valid MicroPython UICR data.\n' +
                    'Could not find a MicroPython region in the regions table.'));
                expect(FS.read('shouldNotBeDeleted.py')).toBe('An error importing should keep files');
                done();
            });
        });

        it('Empty MicroPython Universal Hex throws an error with all messages', function(done) {
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {
                FS.write('shouldNotBeDeleted.py', 'An error importing should keep files');

                var throwsError = function() {
                    FS.importHexFiles(microPyIntelHex);
                }

                expect(throwsError).toThrow(new Error(
                    'Intel Hex does not have any files to import'));
                expect(FS.read('shouldNotBeDeleted.py')).toBe('An error importing should keep files');
                done();
            });
        });

        it('Empty MicroPython Intel Hex throws an error with all messages', function(done) {
            var FS = microbitFsWrapper();
            FS.setupFilesystem().then(function() {
                FS.write('shouldNotBeDeleted.py', 'An error importing should keep files');

                var throwsError = function() {
                    FS.importHexFiles(universalHexLines.join('\n'));
                }

                expect(throwsError).toThrow(new Error(
                    'Hex with ID 39168 from Universal Hex does not have any files to import'));
                expect(FS.read('shouldNotBeDeleted.py')).toBe('An error importing should keep files');
                done();
            });
        });
    });
});
