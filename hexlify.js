/**
 * Module to add and remove Python scripts into and from a MicroPython hex.
 */
var upyhex = (function() {
    'use strict';

    /** User script located at specific flash address. */
    var USER_CODE_START_ADDR = 0x3e000;
    var USER_CODE_LEN = 8 * 1024;
    var USER_CODE_END_ADDR = USER_CODE_START_ADDR + USER_CODE_LEN;

    /** User code header */
    var USER_CODE_HEADER_SIZE = 4;
    var USER_CODE_HEADER_START_B0_INDEX = 0;
    var USER_CODE_HEADER_START_B1_INDEX = 1;
    var USER_CODE_HEADER_LEN_LSB_INDEX = 2;
    var USER_CODE_HEADER_LEN_MSB_INDEX = 3;

    /** Number of data bytes per Intel Hex record (line). */
    var INTEL_HEX_BYTE_CNT = 16;

    /** Start of user script marked by "MP" + 2 bytes for the script length. */
    var USER_CODE_HEADER_START_B0 = 77;    // 'M'
    var USER_CODE_HEADER_START_B1 = 80;    // 'P'

    /**
     * String placed inside the MicroPython hex string to indicate where to
     * paste the Python Code
     * */
    var HEX_INSERTION_POINT = ":::::::::::::::::::::::::::::::::::::::::::\n";

    /**
     * Converts a string into a byte array of characters.
     * TODO: Update to encode to UTF-8 correctly.
     * @param {Uint8Array|Object[]} byteArray - Array of bytes to convert.
     * @return {string} String output from the conversion.
     */
    function strToBytes(str) {
        var data = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            // TODO: This will only keep the LSB from the UTF-16 code points
            data[i] = str.charCodeAt(i);
        }
        return data;
    }

    /**
     * Converts a byte array into a string of characters.
     * TODO: This currently only deals with single byte characters, so needs to
     *       be expanded to support UTF-8 characters longer than 1 byte.
     * @param {Uint8Array|Object[]} byteArray - Array of bytes to convert.
     * @return {string} String output from the conversion.
     */
    function bytesToStr(byteArray) {
        var result = [];
        for (var i = 0; i < byteArray.length; i++) {
            result.push(String.fromCharCode(byteArray[i]));
        }
        return result.join('');
    }

    /**
     * Removes the old insertion line the input Intel Hex string contains it.
     * @param {string} intelHexStr String with the intel hex lines.
     * @return {string} The Intel Hex string without insertion line.
     */
    function cleanseOldHexFormat(intelHexStr) {
        return intelHexStr.replace(HEX_INSERTION_POINT, '');
    }

    /**
     * Parses through an Intel Hex string to find the Python code at the
     * allocated address and extracts it.
     * @param {string} intelHexStr - Intel Hex block to scan for the code.
     * @return {string} Python code.
     */
    function extractPyStrFromIntelHex(intelHexStr) {
        var pyCodeStr = '';
        var hexFileMemMap = MemoryMap.fromHex(intelHexStr);
        // Check that the known flash location has user code
        if (hexFileMemMap.has(USER_CODE_START_ADDR)) {
            var pyCodeMemMap = hexFileMemMap.slice(USER_CODE_START_ADDR, USER_CODE_LEN);
            var codeBytes = pyCodeMemMap.get(USER_CODE_START_ADDR);
            if ((codeBytes[USER_CODE_HEADER_START_B0_INDEX] === USER_CODE_HEADER_START_B0) &&
                    (codeBytes[USER_CODE_HEADER_START_B1_INDEX] === USER_CODE_HEADER_START_B1)) {
                pyCodeStr = bytesToStr(codeBytes.slice(USER_CODE_HEADER_SIZE));
                // Clean null terminators at the end
                pyCodeStr = pyCodeStr.replace(/\0/g, '');
            }
        }
        return pyCodeStr;
    }

    /**
     * Converts the Python code into the Intel Hex format expected by
     * MicroPython and injects it into a Intel Hex string containing a marker.
     * @param {string} intelHexStr - Intel Hex block to inject the code.
     * @param {string} pyStr - Python code string.
     * @return {string} Intel Hex string with the Python code injected.
     */
    function injectPyStrIntoIntelHex(intelHexStr, pyStr) {
        var codeBytes = strToBytes(pyStr);
        var blockLength = USER_CODE_HEADER_SIZE + codeBytes.length;
        // Check the data block fits in the allocated flash area
        if (blockLength > USER_CODE_LEN) {
            throw new RangeError('Too long');
        }
        // Older DAPLink versions need the last line to be padded
        blockLength += INTEL_HEX_BYTE_CNT - (blockLength % INTEL_HEX_BYTE_CNT);
        // The user script block has to start with "MP" marker + script length
        var blockBytes = new Uint8Array(blockLength);
        blockBytes[0] = USER_CODE_HEADER_START_B0;
        blockBytes[1] = USER_CODE_HEADER_START_B1;
        blockBytes[2] = codeBytes.length & 0xff;
        blockBytes[3] = (codeBytes.length >> 8) & 0xff;
        blockBytes.set(codeBytes, USER_CODE_HEADER_SIZE);
        // Convert to Intel Hex format
        intelHexStr = cleanseOldHexFormat(intelHexStr);
        var intelHexMap = MemoryMap.fromHex(intelHexStr);
        intelHexMap.set(USER_CODE_START_ADDR, blockBytes);
        // Older versions of DAPLink need the file to end in a new line
        return intelHexMap.asHexString() + '\n';
    }

    return {
        extractPyStrFromIntelHex: extractPyStrFromIntelHex,
        injectPyStrIntoIntelHex: injectPyStrIntoIntelHex,
    };
}());

/* Attach to the global object if running in node */
if (typeof module !== 'undefined' && module.exports) {
    global.upyhex = upyhex;
}
