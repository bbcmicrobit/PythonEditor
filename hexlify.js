/**
 * This file contains two modules, one generic tool for manipulating data in the
 * Intel Hex format, other specific to manipulating micro:bit MicroPython hex
 * data.
 * 
 * TODO: Extra tests! Only the existing tests have been updated for the original
 *       refactor into these modules. Need more for the extra functions.
 */


/**
 * Generic data manipulation of the Intel Hex format.
 * https://en.wikipedia.org/wiki/Intel_HEX
 * This module currently only contains the basic functionality required by the
 * purpose of the upyhex module below.
 */
var ihexlify = (function() {
    'use strict';

    /** Start character for each record (line) of the hex. */
    var START_CODE_STR = ':';

    /** Record types. */
    var RECORD_TYPE_DATA = 0;
    var RECORD_END_OF_FILE = 1;
    var RECORD_EXT_SEGMENT_ADDR = 2;
    var RECORD_START_SEGMENT_ADDR = 3;
    var RECORD_EXT_LINEAR_ADDR = 4;
    var RECORD_START_LINEAR_ADDR = 5;

    /** Position of the record fields in a Intel Hex string. */
    var STR_IND_START_CODE = 0;
    var STR_IND_BYTE_CNT = 1;
    var STR_IND_ADDR = 3;
    var STR_IND_RECORD_TYPE = 7;
    var STR_IND_DATA = 9;

    /** Position of the record fields in a Intel Hex byte array. */
    var BYTE_IND_BYTE_CNT = 0;
    var BYTE_IND_ADDR_HIGH = 1;
    var BYTE_IND_ADDR_LOW = 2;
    var BYTE_IND_RECORD_TYPE = 3;
    var BYTE_IND_DATA = 4;

    /** Sizes in bytes and characters for each record structure field. */
    var SIZE_C_START_CODE = START_CODE_STR.length;
    var SIZE_B_BYTE_CNT = 1;
    var SIZE_C_BYTE_CNT = SIZE_B_BYTE_CNT * 2;
    var SIZE_B_ADDR = 2;
    var SIZE_C_ADDR = SIZE_B_ADDR * 2;
    var SIZE_B_RECORD_TYPE = 1;
    var SIZE_C_RECORD_TYPE = SIZE_B_RECORD_TYPE * 2;
    var SIZE_B_CHECKSUM = 1;
    var SIZE_C_CHECKSUM = SIZE_B_CHECKSUM * 2;

    /** Bytes between START_CODE and the data fields. */
    var SIZE_B_PRE_DATA = SIZE_B_BYTE_CNT + SIZE_B_ADDR + SIZE_B_RECORD_TYPE;

    /** Size, in bytes and characters, of fields after the data field. */
    var SIZE_B_POS_DATA = SIZE_B_CHECKSUM;
    var SIZE_C_POS_DATA = SIZE_C_CHECKSUM;

    /**
     * Converts each byte in a an array into a single concatenated hex string.
     * @param {Uint8Array|Object[]} byteArray - Bytes to convert into hex str.
     * @return {string} The hex string form from the input data.
     */
    function bytesToHexStr(byteArray) {
        var result = '';
        for (var i = 0; i < byteArray.length; ++i) {
            if (byteArray[i] < 16) {
                result += '0';
            }
            result += byteArray[i].toString(16);
        }
        return result.toUpperCase();
    }

    /**
     * Converts an string of hex data (not intel hex) into an array of bytes.
     * @param {string} hexStr - String of plain hex data.
     * @return {Uint8Array} Array of bytes with the data.
     */
    function hexStrToBytes(hexStr) {
        // String has to have an even number of characters
        if (hexStr.length % 2 !== 0) {
            throw new RangeError('Hex str to parse has odd number of chars.');
        }
        var result = new Uint8Array(hexStr.length / 2);
        for (var i = 0; i < result.length; i++) {
            result[i] = parseInt(hexStr.substr(i * 2, 2), 16);
        }
        return result;
    }

    /**
     * Calculates checksum by taking the LSB of the 2's complement (negative) of
     * the sum of all bytes in the array, or up to the delimiter.
     * @param {Uint8Array|Object[]} byteArray - Array with single byte per item.
     * @param {number} [byteCnt] - Optional length of array items to checksum.
     * @return {number} Intel Hex checksum for a record.
     */
    function checksum(byteArray, byteCnt) {
        var checksum = 0;
        byteCnt = byteCnt || byteArray.length;
        for (var i = 0; i < byteCnt; ++i) {
            checksum += byteArray[i];
        }
        return (-checksum) & 0xff;
    }

    /**
     * Validates if the input string is a valid single Intel Hex record.
     * TODO: This is a very basic check for start character and hex value, could
     *       be expanded to validate valid fields like byte count matches data 
     *       size, or the checksum at the end.
     * @param {string} intelHexRecord - String containing a single record (line)
     *         of Intel Hex.
     * @return {boolean} True if the string is a valid Intel Hex record.
     */
    function isRecordValid(intelHexRecord) {
        if (intelHexRecord[0] !== START_CODE_STR) {
            return false;
        }
        return intelHexRecord.slice(1).match(/^[a-f0-9]/i) !== null;
    }

    /**
     * Extracts the Record Type field (as a string) from a Intel Hex record.
     * @param {string} intelHexRecord - Intel Hex string.
     * @return {?string} Hex string with the Record Type.
     */
    function getRecordTypeHexStr(intelHexRecord) {
        if (!isRecordValid(intelHexRecord)) return null;
        return intelHexRecord.substr(STR_IND_RECORD_TYPE, SIZE_C_RECORD_TYPE);
    }

    /**
     * Extracts the Record Type field (as a number) from a Intel Hex record.
     * @param {string} intelHexRecord - Intel Hex string.
     * @return {?number} Number representing the Record Type.
     */
    function getRecordType(intelHexRecord) {
        var typeStr = getRecordTypeHexStr(intelHexRecord);
        var typeNumber = parseInt(typeStr, 16);
        if (isNaN(typeNumber)) {
            typeNumber = null;
        }
        return typeNumber;
    }

    /**
     * Extracts the Data field (as a string) from a single Intel Hex record.
     * @param {string} intelHexRecord - Intel Hex string.
     * @return {?string} Hex string with the Record Type.
     */
    function getRecordDataHexStr(intelHexRecord) {
        if (!isRecordValid(intelHexRecord)) return null;
        return intelHexRecord.slice(STR_IND_DATA, -(SIZE_C_POS_DATA));
    }

    /**
     * Converts a byte array into a string of Intel Hex. The start address and
     * amount of bytes per record are also required.
     * @param {number} addr - Start address for the data.
     * @param {number} byteCnt - Number of bytes per Intel Hex record (line).
     * @param {Uint8Array|Object[]} byteArray - Data in an array of bytes.
     * @return {string} Intel Hex string.
     */
    function bytesToIntelHexStr(addr, byteCnt, byteArray) {
        // Byte count has to be a number that fits in 2 hex digits
        if (!(byteCnt <= 0xFF)) {
            throw new RangeError('Invalid Byte Count');
        }
        // Array size needs to fit all the record fields in addition to the data
        var chunk = (new Uint8Array(
                SIZE_B_PRE_DATA + byteCnt + SIZE_B_POS_DATA)).fill(0xFF);
        var output = [];
        for (var i = 0; i < byteArray.length; i += byteCnt, addr += byteCnt) {
            // Fill beginning of record structure
            chunk[BYTE_IND_BYTE_CNT] = byteCnt;
            chunk[BYTE_IND_ADDR_HIGH] = (addr >> 8) & 0xff; // MSB 16-bit addr
            chunk[BYTE_IND_ADDR_LOW] = addr & 0xff;         // LSB 16-bit addr
            chunk[BYTE_IND_RECORD_TYPE] = RECORD_TYPE_DATA; // record type
            // Add the input data
            for (var j = 0; j < byteCnt; ++j) {
                chunk[BYTE_IND_DATA + j] = byteArray[i + j];
            }
            // Calculate and add checksum as last byte
            chunk[chunk.length-1] = checksum(chunk, SIZE_B_PRE_DATA + byteCnt);
            // Form record into string format and add it to output
            output.push(START_CODE_STR + bytesToHexStr(chunk));
        }
        return output.join('\n');
    }

    /**
     * Converts a string of Intel Hex into a byte array with only the data.
     * TODO: This function only supports converting data records, should be
     *       expanded to deal with the other record types, specially those that
     *       change the addressing.
     * @param {string} intelHexStr - String with Intel Hex records.
     * @return {Uint8Array[]} Array of "byte arrays" with only the data. An
     *         array item per Intel Hex record, each being a Uint8Array with the
     *         data. 
     */
    function intelHexStrToBytes(intelHexStr) {
        var lines = intelHexStr.trimRight().split(/\r?\n/);
        if (lines.length <= 0) {
            return '';
        }
        var dataBytes = [];
        for (var i = 0; i < lines.length; i++) {
            var recordType = getRecordType(lines[i]);
            if (recordType !== RECORD_TYPE_DATA) {
                throw new Error('A record in line ' + i + ' of the Intel Hex ' +
                                'string is not of the "data" type');
            }
            var dataOnlyStr = getRecordDataHexStr(lines[i]);
            dataBytes.push(hexStrToBytes(dataOnlyStr));
        }
        // TODO: Append all Uint8Array from dataBytes into a single Uint8Array
        return dataBytes;
    }

    /**
     * Creates an Intel Hex Extended Linear Address record for a given address.
     * @param {number} addr - Address to create the record.
     * @return {string} Intel Hex Extended Linear Address record.
     */
    function createExtLinearAddrRecord(addr) {
        // The size of the data field for a Extended Linear Address is 2 bytes
        var byteCnt = 2;
        var recordBytes =
                new Uint8Array(SIZE_B_PRE_DATA + byteCnt + SIZE_B_POS_DATA);
        // Fill beginning of record structure
        recordBytes[BYTE_IND_BYTE_CNT] = byteCnt;
        recordBytes[BYTE_IND_ADDR_HIGH] = 0; // address field ignored
        recordBytes[BYTE_IND_ADDR_LOW] = 0;  // typically 00 00
        recordBytes[BYTE_IND_RECORD_TYPE] = RECORD_EXT_LINEAR_ADDR;
        // Only take the 2 MSB of the Big Ending 4 bytes address
        recordBytes[BYTE_IND_DATA] = (addr >> 24) & 0xff;
        recordBytes[BYTE_IND_DATA + 1] = (addr >> 16) & 0xff;
        // Calculate and add checksum as last byte
        recordBytes[recordBytes.length - 1] =
                checksum(recordBytes, SIZE_B_PRE_DATA + byteCnt);
       return START_CODE_STR + bytesToHexStr(recordBytes);
    }

    return {
        bytesToIntelHexStr: bytesToIntelHexStr,
        intelHexStrToBytes: intelHexStrToBytes,
        createExtLinearAddrRecord: createExtLinearAddrRecord
    };
}());


/**
 * Module to add and remove Python scripts into and from a MicroPython hex.
 */
var upyhex = (function() {
    'use strict';

    /** Start of user script marked by "MP" + 2 bytes for the script length. */
    var USER_SCRIPT_START_BYTE_0 = 77;    // 'M'
    var USER_SCRIPT_START_BYTE_1 = 80;    // 'P'

    /** User script located at specific flash address. */
    var USER_SCRIPT_START_ADDR = 0x3e000;

    /** User script header size. */
    var USER_SCRIPT_HEADER_CHARS = 4;

    /** When user script added. */
    var USER_SCRIPT_MAX_LENGTH = 8192;

    /** Number of data bytes per Intel Hex record (line). */
    var INTEL_HEX_BYTE_CNT = 16;

    /**
     * String placed inside the MicroPython hex string to indicate where to
     * paste the Python Code
     * */
    var HEX_INSERTION_POINT = ":::::::::::::::::::::::::::::::::::::::::::";

    /**
     * Converts a user Python script into the Intel Hex format with the header
     * and the address expected by MicroPython and configured for the micro:bit
     * hex file format.
     * @param {string} pyStr - Python code to convert.
     * @return {string} Code in Intel Hex string formatted for the micro:bit.
     */
    function pyStrToIntelHex(pyStr) {
        // Add header to the script size
        var dataLength = USER_SCRIPT_HEADER_CHARS + pyStr.length;
        // Add padding for the data field size in the Intel Hex records
        dataLength += INTEL_HEX_BYTE_CNT - (dataLength % INTEL_HEX_BYTE_CNT);
        // Check the data block fits in the allocated flash area
        if (dataLength > USER_SCRIPT_MAX_LENGTH) {
            throw new RangeError('Too long');
        }
        // The user script has to start with "MP" marker + script length
        var data = new Uint8Array(dataLength);
        data[0] = USER_SCRIPT_START_BYTE_0;
        data[1] = USER_SCRIPT_START_BYTE_1;
        data[2] = pyStr.length & 0xff;
        data[3] = (pyStr.length >> 8) & 0xff;
        for (var i = 0; i < pyStr.length; ++i) {
            data[4 + i] = pyStr.charCodeAt(i);
        }
        // Convert to Intel Hex format
        return ihexlify.bytesToIntelHexStr(
                USER_SCRIPT_START_ADDR, INTEL_HEX_BYTE_CNT, data);
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
     * Takes a block if Intel Hex records, extracts the data, discards the 
     * headers required by MicroPython and converts the rest into a string.
     * TODO: This function takes advantage of the way the return value from 
     *       ihexlify.intelHexStrToBytes() is formatted (an array of Uint8Array)
     *       so will need to be completely rewritten if that function is updated
     *       to return a single Uint8Array with all the data.
     * @param {string} intelHexStr - Intel Hex block to scan for the code.
     * @return {strin} The Python code.
     */
    function intelHexToPyStr(intelHexStr) {
        // Convert the Intel Hex block into an array of Uint8Arrays, one item
        // per record
        var output = ihexlify.intelHexStrToBytes(intelHexStr);
        // Convert the bytes from each record into a string
        for (var i = 0; i < output.length; i++) {
            output[i] = bytesToStr(output[i]);
        }
        // Discard the header from the beginning, and clean the null terminator
        output[0] = output[0].slice(4);
        var last = output.length - 1;
        output[last] = output[last].replace(/\0/g, '');
        return output.join('');
    }

    /**
     * Parses through an Intel Hex string to find the Python code at the
     * allocated address and extracts it.
     * @param {string} intelHexStr - Intel Hex block to scan for the code.
     * @return {string} Python code.
     */
    function extractPyStrFromIntelHex(intelHexStr) {
        var hex_lines = intelHexStr.trimRight().split(/\r?\n/);
        var extAddrRecord =
                ihexlify.createExtLinearAddrRecord(USER_SCRIPT_START_ADDR);
        var start_line = hex_lines.lastIndexOf(extAddrRecord);
        if (start_line > 0) {
            var lines = hex_lines.slice(start_line + 1, -2);
            var blob = lines.join('\n');
            if (blob === '') {
                return '';
            } else {
                return intelHexToPyStr(blob);
            }
        } else {
            return '';
        }
    }

    /**
     * Converts the Python code into the Intel Hex format expected by
     * MicroPython and injects it into a Intel Hex string containing a marker.
     * @param {string} intelHexStr - Intel Hex block to inject the code.
     * @param {string} pyStr - Python code string.
     * @return {string} Intel Hex string with the Python code injected.
     */
    function injectPyStrIntoIntelHex(intelHexStr, pyStr) {
        var pyCodeIntelHex = pyStrToIntelHex(pyStr);
        return intelHexStr.replace(HEX_INSERTION_POINT, pyCodeIntelHex);
    }

    return {
        pyStrToIntelHex: pyStrToIntelHex,
        intelHexToPyStr: intelHexToPyStr,
        extractPyStrFromIntelHex: extractPyStrFromIntelHex,
        injectPyStrIntoIntelHex: injectPyStrIntoIntelHex,
    };
}());

/* Attach to the global object if running in node */
if (typeof module !== 'undefined' && module.exports) {
    global.upyhex = upyhex;
}
