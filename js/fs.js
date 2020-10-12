/**
 * Wrapper for microbit-fs and microbit-universal-hex to perform filesystem
 * operations into two hex files.
 *   https://github.com/microbit-foundation/microbit-fs
 *   https://github.com/microbit-foundation/microbit-universal-hex
 */
'use strict';

/**
 * @returns An object with the fs wrapper.
 */
var microbitFsWrapper = function() {
    var fsWrapper = {};

    var fs1 = null;
    var fs2 = null;

    var commonFsSize = 20 * 1024;

    /**
     * Looks up the object keys from the MicropythonFsHex prototype and
     * creates functions with the same name in this object to run the same
     * method in both instances of MicropythonFsHex()
     */
    function duplicateKeys() {
        // Only start the function duplication once both instances have been created
        Object.keys(Object.getPrototypeOf(fs1)).forEach(function(key) {
            // We will duplicate all functions to call both instances
            if (typeof fs1[key] === 'function') {
                fsWrapper[key] = function() {
                    var return1 = fs1[key].apply(fs1, arguments);
                    var return2 =  fs2[key].apply(fs2, arguments);
                    // FIXME: Keep this during general testing, probably remove on final release for speed
                    if (JSON.stringify(return1) !== JSON.stringify(return2)) {
                        console.error('Return from call to ' + key + ' differs:\n\t' + return1 + '\n\t'+ return2 );
                    }
                    return return1;
                }
            }
        });
    }

    /**
     * Fetches both MicroPython hexes and sets up the file system with the
     * initial main.py
     */
    fsWrapper.setupFilesystem = function() {
        var deferred1 = $.get('micropython/microbit-micropython-v1.hex', function(fileStr) {
            fs1 = new microbitFs.MicropythonFsHex(fileStr, {
                'maxFsSize': commonFsSize,
            });
        }).fail(function() {
            console.error('Could not load the MicroPython hex 1 file.');
        });
        var deferred2 = $.get('micropython/microbit-micropython-v2.hex', function(fileStr) {
            fs2 = new microbitFs.MicropythonFsHex(fileStr, {
                'maxFsSize': commonFsSize,
            });
        }).fail(function() {
            console.error('Could not load the MicroPython hex 2 file.');
        });

        return $.when(deferred1, deferred2).done(function() {
            duplicateKeys();
        });
    };

    /**
     * @returns {string} Universal Hex string.
     */
    fsWrapper.getUniversalHex = function() {
        return microbitUh.createUniversalHex([
            { 'hex': fs1.getIntelHex(), 'boardId': 0x9900 },
            { 'hex': fs2.getIntelHex(), 'boardId': 0x9903 },
        ]);
    };

    /**
     * @param {string} boardId String with the Board ID for the generation.
     * @returns Uint8Array with the data for the given Board ID.
     */
    fsWrapper.getBytesForBoardId = function(boardId) {
        if (boardId == '9900' || boardId == '9901') {
            return fs1.getIntelHexBytes();
        } else if (boardId == '9903' || boardId == '9904') {
            return fs2.getIntelHexBytes();
        } else {
            throw Error('Could not recognise the Board ID ' + boardId);
        }
    };

    /**
     * @param {string} boardId String with the Board ID for the generation.
     * @returns ArrayBuffer with the Intel Hex data for the given Board ID.
     */
    fsWrapper.getIntelHexForBoardId = function(boardId) {
        if (boardId == '9900' || boardId == '9901') {
            var hexStr = fs1.getIntelHex();
        } else if (boardId == '9903' || boardId == '9904') {
            var hexStr = fs2.getIntelHex()
        } else {
            throw Error('Could not recognise the Board ID ' + boardId);
        }
        // iHex is ASCII so we can do a 1-to-1 conversion from chars to bytes
        var hexBuffer = new Uint8Array(hexStr.length);
        for (var i=0, strLen=hexStr.length; i < strLen; i++) {
            hexBuffer[i] = hexStr.charCodeAt(i);
        }
        return hexBuffer.buffer;
    };

    /**
     * Import the files from the provide hex string into the filesystem.
     * If the import is successful this deletes all the previous files.
     * 
     * @param {string} hexStr Hex (Intel or Universal) string with files to
     *   import.
     * @return {string[]} Array with the filenames of all files imported.
     */
    fsWrapper.importFiles = function(hexStr) {
        var hex = '';
        if (microbitUh.isUniversalHex(hexStr)) {
            // For now only extract one of the file systems
            microbitUh.separateUniversalHex(hexStr).forEach(function(hexObj) {
                if (hexObj.boardId == 0x9900 || hexObj.boardId == 0x9901) {
                    hex = hexObj.hex;
                }
            });
            if (!hex) {
                // TODO: Add this string to the language files
                throw new Error('Universal Hex does not contain data for the supported boards.');
            }
        } else {
            hex = hexStr;
        }

        // TODO: Add this string to the language files
        var errorMsg = 'Not a Universal Hex\n';
        try {
            var filesNames1 = fs1.importFilesFromIntelHex(hex, {
                overwrite: true,
                formatFirst: true
            });
            var filesNames2 = fs2.importFilesFromIntelHex(hex, {
                overwrite: true,
                formatFirst: true
            });
            // FIXME: Keep this during general testing, probably remove on final release for speed
            if (JSON.stringify(filesNames1) !== JSON.stringify(filesNames2)) {
                console.error('Return from importFilesFromIntelHex() differs:' +
                              '\n\t' + return1 + '\n\t'+ return2);
            }
            return filesNames1;
        } catch(e) {
            errorMsg += e.message + '\n';
        }

        // Failed during fs file import, check if there is an appended script
        var code = '';
        try {
            code = microbitFs.getIntelHexAppendedScript(hexStr);
            // If no code is found throw a dummy error to trigger the catch below
            if (!code) throw new Error('No appended code found.');
        } catch(e) {
            // This was originally config.translate.alerts.no_script
            throw new Error(errorMsg + 'Hex file does not contain an appended Python script.');
        }
        fs1.ls().forEach(function(fileName) {
            fs1.remove(fileName);
        });
        fs1.write('main.py', code);
        fs2.ls().forEach(function(fileName) {
            fs2.remove(fileName);
        });
        fs2.write('main.py', code);
        return ['main.py'];
    };

    return fsWrapper;
};

if (typeof module !== 'undefined' && module.exports) {
    global.microbitFsWrapper = microbitFsWrapper;
} else {
    window.microbitFsWrapper = microbitFsWrapper;
}
