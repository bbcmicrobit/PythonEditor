/**
 * Wrapper for microbit-fs to perform filesystem operations into two hex files.
 *   https://github.com/microbit-foundation/microbit-fs
 */
'use strict';

/**
 * @returns An object with the fs wrapper.
 */
var fs = function() {
    // micropythonFs wrapper to return
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
        if (fs1 && fs2) {
            Object.keys(Object.getPrototypeOf(fs1)).forEach(function(key) {
                // We will duplicate all functions to call both instances
                if (typeof fs1[key] === "function") {
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
            // Perform simple check in case future microbitFs updates As iterating through the class instance methods depends on the 
            console.log('FS fully initialised');
        }
    }

    /**
     * Fetches both MicroPython hexes and sets up the file system with the
     * initial main.py
     */
    fsWrapper.setupFilesystem = function() {
        $.get('firmware.hex', function(fileStr) {
            fs1 = new microbitFs.MicropythonFsHex(fileStr, {
                'maxFsSize': commonFsSize,
            });
            // The the current main.py
            fs1.write('main.py', EDITOR.getCode());
            duplicateKeys();
        }).error(function() {
            console.error('Could not load the MicroPython hex file.');
        });
        $.get('firmware2.hex', function(fileStr) {
            fs2 = new microbitFs.MicropythonFsHex(fileStr, {
                'maxFsSize': commonFsSize,
            });
            // The the current main.py
            fs2.write('main.py', EDITOR.getCode());
            duplicateKeys();
        }).error(function() {
            console.error('Could not load the MicroPython hex file.');
        });
        // TODO: The user could have edited the editor content and the main.py
        // files would be out of sync
    };

    /**
     * @returns String with a fat hex.
     */
    fsWrapper.getFatHex = function() {
        return microbitUh.createUniversalHex([
            { 'hex': fs1.getIntelHex(), 'boardId': 0x9900 },
            { 'hex': fs2.getIntelHex(), 'boardId': 0x9903 },
        ]);
    };

    /**
     * @param boardId String with the Board ID for the generation.
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

    return fsWrapper;
};

if (typeof module !== 'undefined' && module.exports) {
    global.fs = fs;
} else {
    window.fs = fs;
}
