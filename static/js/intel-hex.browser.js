(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MemoryMap = factory());
}(this, (function () { 'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Parser/writer for the "Intel hex" format.
 */

/*
 * A regexp that matches lines in a .hex file.
 *
 * One hexadecimal character is matched by "[0-9A-Fa-f]".
 * Two hex characters are matched by "[0-9A-Fa-f]{2}"
 * Eight or more hex characters are matched by "[0-9A-Fa-f]{8,}"
 * A capture group of two hex characters is "([0-9A-Fa-f]{2})"
 *
 * Record mark         :
 * 8 or more hex chars  ([0-9A-Fa-f]{8,})
 * Checksum                              ([0-9A-Fa-f]{2})
 * Optional newline                                      (?:\r\n|\r|\n|)
 */
var hexLineRegexp = /:([0-9A-Fa-f]{8,})([0-9A-Fa-f]{2})(?:\r\n|\r|\n|)/g;

// Takes a Uint8Array as input,
// Returns an integer in the 0-255 range.
function checksum(bytes) {
    return -bytes.reduce(function (sum, v) {
        return sum + v;
    }, 0) & 0xFF;
}

// Takes two Uint8Arrays as input,
// Returns an integer in the 0-255 range.
function checksumTwo(array1, array2) {
    var partial1 = array1.reduce(function (sum, v) {
        return sum + v;
    }, 0);
    var partial2 = array2.reduce(function (sum, v) {
        return sum + v;
    }, 0);
    return -(partial1 + partial2) & 0xFF;
}

// Trivial utility. Converts a number to hex and pads with zeroes up to 2 characters.
function hexpad(number) {
    return number.toString(16).toUpperCase().padStart(2, '0');
}

// Polyfill as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

/**
 * @class MemoryMap
 *
 * Represents the contents of a memory layout, with main focus into (possibly sparse) blocks of data.
 *<br/>
 * A {@linkcode MemoryMap} acts as a subclass of
 * {@linkcode https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map|Map}.
 * In every entry of it, the key is the starting address of a data block (an integer number),
 * and the value is the <tt>Uint8Array</tt> with the data for that block.
 *<br/>
 * The main rationale for this is that a .hex file can contain a single block of contiguous
 * data starting at memory address 0 (and it's the common case for simple .hex files),
 * but complex files with several non-contiguous data blocks are also possible, thus
 * the need for a data structure on top of the <tt>Uint8Array</tt>s.
 *<br/>
 * In order to parse <tt>.hex</tt> files, use the {@linkcode MemoryMap.fromHex} <em>static</em> factory
 * method. In order to write <tt>.hex</tt> files, create a new {@linkcode MemoryMap} and call
 * its {@linkcode MemoryMap.asHexString} method.
 *
 * @extends Map
 * @example
 * import MemoryMap from 'nrf-intel-hex';
 *
 * let memMap1 = new MemoryMap();
 * let memMap2 = new MemoryMap([[0, new Uint8Array(1,2,3,4)]]);
 * let memMap3 = new MemoryMap({0: new Uint8Array(1,2,3,4)});
 * let memMap4 = new MemoryMap({0xCF0: new Uint8Array(1,2,3,4)});
 */

var MemoryMap = function () {
    /**
     * @param {Iterable} blocks The initial value for the memory blocks inside this
     * <tt>MemoryMap</tt>. All keys must be numeric, and all values must be instances of
     * <tt>Uint8Array</tt>. Optionally it can also be a plain <tt>Object</tt> with
     * only numeric keys.
     */
    function MemoryMap(blocks) {
        _classCallCheck(this, MemoryMap);

        this._blocks = new Map();

        if (blocks && typeof blocks[Symbol.iterator] === 'function') {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = blocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tuple = _step.value;

                    if (!(tuple instanceof Array) || tuple.length !== 2) {
                        throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
                    }
                    this.set(tuple[0], tuple[1]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else if ((typeof blocks === 'undefined' ? 'undefined' : _typeof(blocks)) === 'object') {
            // Try iterating through the object's keys
            var addrs = Object.keys(blocks);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = addrs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var addr = _step2.value;

                    this.set(parseInt(addr), blocks[addr]);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        } else if (blocks !== undefined && blocks !== null) {
            throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
        }
    }

    _createClass(MemoryMap, [{
        key: 'set',
        value: function set(addr, value) {
            if (!Number.isInteger(addr)) {
                throw new Error('Address passed to MemoryMap is not an integer');
            }
            if (addr < 0) {
                throw new Error('Address passed to MemoryMap is negative');
            }
            if (!(value instanceof Uint8Array)) {
                throw new Error('Bytes passed to MemoryMap are not an Uint8Array');
            }
            return this._blocks.set(addr, value);
        }
        // Delegate the following to the 'this._blocks' Map:

    }, {
        key: 'get',
        value: function get(addr) {
            return this._blocks.get(addr);
        }
    }, {
        key: 'clear',
        value: function clear() {
            return this._blocks.clear();
        }
    }, {
        key: 'delete',
        value: function _delete(addr) {
            return this._blocks.delete(addr);
        }
    }, {
        key: 'entries',
        value: function entries() {
            return this._blocks.entries();
        }
    }, {
        key: 'forEach',
        value: function forEach(callback, that) {
            return this._blocks.forEach(callback, that);
        }
    }, {
        key: 'has',
        value: function has(addr) {
            return this._blocks.has(addr);
        }
    }, {
        key: 'keys',
        value: function keys() {
            return this._blocks.keys();
        }
    }, {
        key: 'values',
        value: function values() {
            return this._blocks.values();
        }
    }, {
        key: Symbol.iterator,
        value: function value() {
            return this._blocks[Symbol.iterator]();
        }

        /**
         * Parses a string containing data formatted in "Intel HEX" format, and
         * returns an instance of {@linkcode MemoryMap}.
         *<br/>
         * The insertion order of keys in the {@linkcode MemoryMap} is guaranteed to be strictly
         * ascending. In other words, when iterating through the {@linkcode MemoryMap}, the addresses
         * will be ordered in ascending order.
         *<br/>
         * The parser has an opinionated behaviour, and will throw a descriptive error if it
         * encounters some malformed input. Check the project's
         * {@link https://github.com/NordicSemiconductor/nrf-intel-hex#Features|README file} for details.
         *<br/>
         * If <tt>maxBlockSize</tt> is given, any contiguous data block larger than that will
         * be split in several blocks.
         *
         * @param {String} hexText The contents of a .hex file.
         * @param {Number} [maxBlockSize=Infinity] Maximum size of the returned <tt>Uint8Array</tt>s.
         *
         * @return {MemoryMap}
         *
         * @example
         * import MemoryMap from 'nrf-intel-hex';
         *
         * let intelHexString =
         *     ":100000000102030405060708090A0B0C0D0E0F1068\n" +
         *     ":00000001FF";
         *
         * let memMap = MemoryMap.fromHex(intelHexString);
         *
         * for (let [address, dataBlock] of memMap) {
         *     console.log('Data block at ', address, ', bytes: ', dataBlock);
         * }
         */

    }, {
        key: 'join',


        /**
         * Returns a <strong>new</strong> instance of {@linkcode MemoryMap}, containing
         * the same data, but concatenating together those memory blocks that are adjacent.
         *<br/>
         * The insertion order of keys in the {@linkcode MemoryMap} is guaranteed to be strictly
         * ascending. In other words, when iterating through the {@linkcode MemoryMap}, the addresses
         * will be ordered in ascending order.
         *<br/>
         * If <tt>maxBlockSize</tt> is given, blocks will be concatenated together only
         * until the joined block reaches this size in bytes. This means that the output
         * {@linkcode MemoryMap} might have more entries than the input one.
         *<br/>
         * If there is any overlap between blocks, an error will be thrown.
         *<br/>
         * The returned {@linkcode MemoryMap} will use newly allocated memory.
         *
         * @param {Number} [maxBlockSize=Infinity] Maximum size of the <tt>Uint8Array</tt>s in the
         * returned {@linkcode MemoryMap}.
         *
         * @return {MemoryMap}
         */
        value: function join() {
            var maxBlockSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;


            // First pass, create a Map of address→length of contiguous blocks
            var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
                return a - b;
            });
            var blockSizes = new Map();
            var lastBlockAddr = -1;
            var lastBlockEndAddr = -1;

            for (var i = 0, l = sortedKeys.length; i < l; i++) {
                var blockAddr = sortedKeys[i];
                var blockLength = this.get(sortedKeys[i]).length;

                if (lastBlockEndAddr === blockAddr && lastBlockEndAddr - lastBlockAddr < maxBlockSize) {
                    // Grow when the previous end address equals the current,
                    // and we don't go over the maximum block size.
                    blockSizes.set(lastBlockAddr, blockSizes.get(lastBlockAddr) + blockLength);
                    lastBlockEndAddr += blockLength;
                } else if (lastBlockEndAddr <= blockAddr) {
                    // Else mark a new block.
                    blockSizes.set(blockAddr, blockLength);
                    lastBlockAddr = blockAddr;
                    lastBlockEndAddr = blockAddr + blockLength;
                } else {
                    throw new Error('Overlapping data around address 0x' + blockAddr.toString(16));
                }
            }

            // Second pass: allocate memory for the contiguous blocks and copy data around.
            var mergedBlocks = new MemoryMap();
            var mergingBlock = void 0;
            var mergingBlockAddr = -1;
            for (var _i = 0, _l = sortedKeys.length; _i < _l; _i++) {
                var _blockAddr = sortedKeys[_i];
                if (blockSizes.has(_blockAddr)) {
                    mergingBlock = new Uint8Array(blockSizes.get(_blockAddr));
                    mergedBlocks.set(_blockAddr, mergingBlock);
                    mergingBlockAddr = _blockAddr;
                }
                mergingBlock.set(this.get(_blockAddr), _blockAddr - mergingBlockAddr);
            }

            return mergedBlocks;
        }

        /**
         * Given a {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map|<tt>Map</tt>}
         * of {@linkcode MemoryMap}s, indexed by a alphanumeric ID,
         * returns a <tt>Map</tt> of address to tuples (<tt>Arrays</tt>s of length 2) of the form
         * <tt>(id, Uint8Array)</tt>s.
         *<br/>
         * The scenario for using this is having several {@linkcode MemoryMap}s, from several calls to
         * {@link module:nrf-intel-hex~hexToArrays|hexToArrays}, each having a different identifier.
         * This function locates where those memory block sets overlap, and returns a <tt>Map</tt>
         * containing addresses as keys, and arrays as values. Each array will contain 1 or more
         * <tt>(id, Uint8Array)</tt> tuples: the identifier of the memory block set that has
         * data in that region, and the data itself. When memory block sets overlap, there will
         * be more than one tuple.
         *<br/>
         * The <tt>Uint8Array</tt>s in the output are
         * {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray|subarrays}
         * of the input data; new memory is <strong>not</strong> allocated for them.
         *<br/>
         * The insertion order of keys in the output <tt>Map</tt> is guaranteed to be strictly
         * ascending. In other words, when iterating through the <tt>Map</tt>, the addresses
         * will be ordered in ascending order.
         *<br/>
         * When two blocks overlap, the corresponding array of tuples will have the tuples ordered
         * in the insertion order of the input <tt>Map</tt> of block sets.
         *<br/>
         *
         * @param {Map.MemoryMap} memoryMaps The input memory block sets
         *
         * @example
         * import MemoryMap from 'nrf-intel-hex';
         *
         * let memMap1 = MemoryMap.fromHex( hexdata1 );
         * let memMap2 = MemoryMap.fromHex( hexdata2 );
         * let memMap3 = MemoryMap.fromHex( hexdata3 );
         *
         * let maps = new Map([
         *  ['file A', blocks1],
         *  ['file B', blocks2],
         *  ['file C', blocks3]
         * ]);
         *
         * let overlappings = MemoryMap.overlapMemoryMaps(maps);
         *
         * for (let [address, tuples] of overlappings) {
         *     // if 'tuples' has length > 1, there is an overlap starting at 'address'
         *
         *     for (let [address, tuples] of overlappings) {
         *         let [id, bytes] = tuple;
         *         // 'id' in this example is either 'file A', 'file B' or 'file C'
         *     }
         * }
         * @return {Map.Array<mixed,Uint8Array>} The map of possibly overlapping memory blocks
         */

    }, {
        key: 'paginate',


        /**
         * Returns a new instance of {@linkcode MemoryMap}, where:
         *
         * <ul>
         *  <li>Each key (the start address of each <tt>Uint8Array</tt>) is a multiple of
         *    <tt>pageSize</tt></li>
         *  <li>The size of each <tt>Uint8Array</tt> is exactly <tt>pageSize</tt></li>
         *  <li>Bytes from the input map to bytes in the output</li>
         *  <li>Bytes not in the input are replaced by a padding value</li>
         * </ul>
         *<br/>
         * The scenario is wanting to prepare pages of bytes for a write operation, where the write
         * operation affects a whole page/sector at once.
         *<br/>
         * The insertion order of keys in the output {@linkcode MemoryMap} is guaranteed
         * to be strictly ascending. In other words, when iterating through the
         * {@linkcode MemoryMap}, the addresses will be ordered in ascending order.
         *<br/>
         * The <tt>Uint8Array</tt>s in the output will be newly allocated.
         *<br/>
         *
         * @param {Number} [pageSize=1024] The size of the output pages, in bytes
         * @param {Number} [pad=0xFF] The byte value to use for padding
         * @return {MemoryMap}
         */
        value: function paginate() {
            var pageSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1024;
            var pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF;

            if (pageSize <= 0) {
                throw new Error('Page size must be greater than zero');
            }
            var outPages = new MemoryMap();
            var page = void 0;

            var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
                return a - b;
            });

            for (var i = 0, l = sortedKeys.length; i < l; i++) {
                var blockAddr = sortedKeys[i];
                var block = this.get(blockAddr);
                var blockLength = block.length;
                var blockEnd = blockAddr + blockLength;

                for (var pageAddr = blockAddr - blockAddr % pageSize; pageAddr < blockEnd; pageAddr += pageSize) {
                    page = outPages.get(pageAddr);
                    if (!page) {
                        page = new Uint8Array(pageSize);
                        page.fill(pad);
                        outPages.set(pageAddr, page);
                    }

                    var offset = pageAddr - blockAddr;
                    var subBlock = void 0;
                    if (offset <= 0) {
                        // First page which intersects the block
                        subBlock = block.subarray(0, Math.min(pageSize + offset, blockLength));
                        page.set(subBlock, -offset);
                    } else {
                        // Any other page which intersects the block
                        subBlock = block.subarray(offset, offset + Math.min(pageSize, blockLength - offset));
                        page.set(subBlock, 0);
                    }
                }
            }

            return outPages;
        }

        /**
         * Locates the <tt>Uint8Array</tt> which contains the given offset,
         * and returns the four bytes held at that offset, as a 32-bit unsigned integer.
         *
         *<br/>
         * Behaviour is similar to {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32|DataView.prototype.getUint32},
         * except that this operates over a {@linkcode MemoryMap} instead of
         * over an <tt>ArrayBuffer</tt>, and that this may return <tt>undefined</tt> if
         * the address is not <em>entirely</em> contained within one of the <tt>Uint8Array</tt>s.
         *<br/>
         *
         * @param {Number} offset The memory offset to read the data
         * @param {Boolean} [littleEndian=false] Whether to fetch the 4 bytes as a little- or big-endian integer
         * @return {Number|undefined} An unsigned 32-bit integer number
         */

    }, {
        key: 'getUint32',
        value: function getUint32(offset, littleEndian) {
            var keys = Array.from(this.keys());

            for (var i = 0, l = keys.length; i < l; i++) {
                var blockAddr = keys[i];
                var block = this.get(blockAddr);
                var blockLength = block.length;
                var blockEnd = blockAddr + blockLength;

                if (blockAddr <= offset && offset + 4 <= blockEnd) {
                    return new DataView(block.buffer, offset - blockAddr, 4).getUint32(0, littleEndian);
                }
            }
            return;
        }

        /**
         * Returns a <tt>String</tt> of text representing a .hex file.
         * <br/>
         * The writer has an opinionated behaviour. Check the project's
         * {@link https://github.com/NordicSemiconductor/nrf-intel-hex#Features|README file} for details.
         *
         * @param {Number} [lineSize=16] Maximum number of bytes to be encoded in each data record.
         * Must have a value between 1 and 255, as per the specification.
         *
         * @return {String} String of text with the .hex representation of the input binary data
         *
         * @example
         * import MemoryMap from 'nrf-intel-hex';
         *
         * let memMap = new MemoryMap();
         * let bytes = new Uint8Array(....);
         * memMap.set(0x0FF80000, bytes); // The block with 'bytes' will start at offset 0x0FF80000
         *
         * let string = memMap.asHexString();
         */

    }, {
        key: 'asHexString',
        value: function asHexString() {
            var lineSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

            var lowAddress = 0; // 16 least significant bits of the current addr
            var highAddress = -1 << 16; // 16 most significant bits of the current addr
            var records = [];
            if (lineSize <= 0) {
                throw new Error('Size of record must be greater than zero');
            } else if (lineSize > 255) {
                throw new Error('Size of record must be less than 256');
            }

            // Placeholders
            var offsetRecord = new Uint8Array(6);
            var recordHeader = new Uint8Array(4);

            var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
                return a - b;
            });
            for (var i = 0, l = sortedKeys.length; i < l; i++) {
                var blockAddr = sortedKeys[i];
                var block = this.get(blockAddr);

                // Sanity checks
                if (!(block instanceof Uint8Array)) {
                    throw new Error('Block at offset ' + blockAddr + ' is not an Uint8Array');
                }
                if (blockAddr < 0) {
                    throw new Error('Block at offset ' + blockAddr + ' has a negative thus invalid address');
                }
                var blockSize = block.length;
                if (!blockSize) {
                    continue;
                } // Skip zero-length blocks


                if (blockAddr > highAddress + 0xFFFF) {
                    // Insert a new 0x04 record to jump to a new 64KiB block

                    // Round up the least significant 16 bits - no bitmasks because they trigger
                    // base-2 negative numbers, whereas subtracting the modulo maintains precision
                    highAddress = blockAddr - blockAddr % 0x10000;
                    lowAddress = 0;

                    offsetRecord[0] = 2; // Length
                    offsetRecord[1] = 0; // Load offset, high byte
                    offsetRecord[2] = 0; // Load offset, low byte
                    offsetRecord[3] = 4; // Record type
                    offsetRecord[4] = highAddress >> 24; // new address offset, high byte
                    offsetRecord[5] = highAddress >> 16; // new address offset, low byte

                    records.push(':' + Array.prototype.map.call(offsetRecord, hexpad).join('') + hexpad(checksum(offsetRecord)));
                }

                if (blockAddr < highAddress + lowAddress) {
                    throw new Error('Block starting at 0x' + blockAddr.toString(16) + ' overlaps with a previous block.');
                }

                lowAddress = blockAddr % 0x10000;
                var blockOffset = 0;
                var blockEnd = blockAddr + blockSize;
                if (blockEnd > 0xFFFFFFFF) {
                    throw new Error('Data cannot be over 0xFFFFFFFF');
                }

                // Loop for every 64KiB memory segment that spans this block
                while (highAddress + lowAddress < blockEnd) {

                    if (lowAddress > 0xFFFF) {
                        // Insert a new 0x04 record to jump to a new 64KiB block
                        highAddress += 1 << 16; // Increase by one
                        lowAddress = 0;

                        offsetRecord[0] = 2; // Length
                        offsetRecord[1] = 0; // Load offset, high byte
                        offsetRecord[2] = 0; // Load offset, low byte
                        offsetRecord[3] = 4; // Record type
                        offsetRecord[4] = highAddress >> 24; // new address offset, high byte
                        offsetRecord[5] = highAddress >> 16; // new address offset, low byte

                        records.push(':' + Array.prototype.map.call(offsetRecord, hexpad).join('') + hexpad(checksum(offsetRecord)));
                    }

                    var recordSize = -1;
                    // Loop for every record for that spans the current 64KiB memory segment
                    while (lowAddress < 0x10000 && recordSize) {
                        recordSize = Math.min(lineSize, // Normal case
                        blockEnd - highAddress - lowAddress, // End of block
                        0x10000 - lowAddress // End of low addresses
                        );

                        if (recordSize) {

                            recordHeader[0] = recordSize; // Length
                            recordHeader[1] = lowAddress >> 8; // Load offset, high byte
                            recordHeader[2] = lowAddress; // Load offset, low byte
                            recordHeader[3] = 0; // Record type

                            var subBlock = block.subarray(blockOffset, blockOffset + recordSize); // Data bytes for this record

                            records.push(':' + Array.prototype.map.call(recordHeader, hexpad).join('') + Array.prototype.map.call(subBlock, hexpad).join('') + hexpad(checksumTwo(recordHeader, subBlock)));

                            blockOffset += recordSize;
                            lowAddress += recordSize;
                        }
                    }
                }
            }

            records.push(':00000001FF'); // EOF record

            return records.join('\n');
        }

        /**
         * Performs a deep copy of the current {@linkcode MemoryMap}, returning a new one
         * with exactly the same contents, but allocating new memory for each of its
         * <tt>Uint8Array</tt>s.
         *
         * @return {MemoryMap}
         */

    }, {
        key: 'clone',
        value: function clone() {
            var cloned = new MemoryMap();

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = _slicedToArray(_step3.value, 2),
                        addr = _step3$value[0],
                        value = _step3$value[1];

                    cloned.set(addr, new Uint8Array(value));
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return cloned;
        }

        /**
         * Given one <tt>Uint8Array</tt>, looks through its contents and returns a new
         * {@linkcode MemoryMap}, stripping away those regions where there are only
         * padding bytes.
         * <br/>
         * The start of the input <tt>Uint8Array</tt> is assumed to be offset zero for the output.
         * <br/>
         * The use case here is dumping memory from a working device and try to see the
         * "interesting" memory regions it has. This assumes that there is a constant,
         * predefined padding byte value being used in the "non-interesting" regions.
         * In other words: this will work as long as the dump comes from a flash memory
         * which has been previously erased (thus <tt>0xFF</tt>s for padding), or from a
         * previously blanked HDD (thus <tt>0x00</tt>s for padding).
         * <br/>
         * This method uses <tt>subarray</tt> on the input data, and thus does not allocate memory
         * for the <tt>Uint8Array</tt>s.
         *
         * @param {Uint8Array} bytes The input data
         * @param {Number} [padByte=0xFF] The value of the byte assumed to be used as padding
         * @param {Number} [minPadLength=64] The minimum number of consecutive pad bytes to
         * be considered actual padding
         *
         * @return {MemoryMap}
         */

    }, {
        key: 'slice',


        /**
         * Returns a new instance of {@linkcode MemoryMap}, containing only data between
         * the addresses <tt>address</tt> and <tt>address + length</tt>.
         * Behaviour is similar to {@linkcode https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/slice|Array.prototype.slice},
         * in that the return value is a portion of the current {@linkcode MemoryMap}.
         *
         * <br/>
         * The returned {@linkcode MemoryMap} might be empty.
         *
         * <br/>
         * Internally, this uses <tt>subarray</tt>, so new memory is not allocated.
         *
         * @param {Number} address The start address of the slice
         * @param {Number} length The length of memory map to slice out
         * @return {MemoryMap}
         */
        value: function slice(address) {
            var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

            if (length < 0) {
                throw new Error('Length of the slice cannot be negative');
            }

            var sliced = new MemoryMap();

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _step4$value = _slicedToArray(_step4.value, 2),
                        blockAddr = _step4$value[0],
                        block = _step4$value[1];

                    var blockLength = block.length;

                    if (blockAddr + blockLength >= address && blockAddr < address + length) {
                        var sliceStart = Math.max(address, blockAddr);
                        var sliceEnd = Math.min(address + length, blockAddr + blockLength);
                        var sliceLength = sliceEnd - sliceStart;
                        var relativeSliceStart = sliceStart - blockAddr;

                        if (sliceLength > 0) {
                            sliced.set(sliceStart, block.subarray(relativeSliceStart, relativeSliceStart + sliceLength));
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return sliced;
        }

        /**
         * Returns a new instance of {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView/getUint32|Uint8Array}, containing only data between
         * the addresses <tt>address</tt> and <tt>address + length</tt>. Any byte without a value
         * in the input {@linkcode MemoryMap} will have a value of <tt>padByte</tt>.
         *
         * <br/>
         * This method allocates new memory.
         *
         * @param {Number} address The start address of the slice
         * @param {Number} length The length of memory map to slice out
         * @param {Number} [padByte=0xFF] The value of the byte assumed to be used as padding
         * @return {MemoryMap}
         */

    }, {
        key: 'slicePad',
        value: function slicePad(address, length) {
            var padByte = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xFF;

            if (length < 0) {
                throw new Error('Length of the slice cannot be negative');
            }

            var out = new Uint8Array(length).fill(padByte);

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _step5$value = _slicedToArray(_step5.value, 2),
                        blockAddr = _step5$value[0],
                        block = _step5$value[1];

                    var blockLength = block.length;

                    if (blockAddr + blockLength >= address && blockAddr < address + length) {
                        var sliceStart = Math.max(address, blockAddr);
                        var sliceEnd = Math.min(address + length, blockAddr + blockLength);
                        var sliceLength = sliceEnd - sliceStart;
                        var relativeSliceStart = sliceStart - blockAddr;

                        if (sliceLength > 0) {
                            out.set(block.subarray(relativeSliceStart, relativeSliceStart + sliceLength), sliceStart - address);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return out;
        }

        /**
         * Checks whether the current memory map contains the one given as a parameter.
         *
         * <br/>
         * "Contains" means that all the offsets that have a byte value in the given
         * memory map have a value in the current memory map, and that the byte values
         * are the same.
         *
         * <br/>
         * An empty memory map is always contained in any other memory map.
         *
         * <br/>
         * Returns boolean <tt>true</tt> if the memory map is contained, <tt>false</tt>
         * otherwise.
         *
         * @param {MemoryMap} memMap The memory map to check
         * @return {Boolean}
         */

    }, {
        key: 'contains',
        value: function contains(memMap) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = memMap[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _step6$value = _slicedToArray(_step6.value, 2),
                        blockAddr = _step6$value[0],
                        block = _step6$value[1];

                    var blockLength = block.length;

                    var slice = this.slice(blockAddr, blockLength).join().get(blockAddr);

                    if (!slice || slice.length !== blockLength) {
                        return false;
                    }

                    for (var i in block) {
                        if (block[i] !== slice[i]) {
                            return false;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return true;
        }
    }, {
        key: 'size',
        get: function get() {
            return this._blocks.size;
        }
    }], [{
        key: 'fromHex',
        value: function fromHex(hexText) {
            var maxBlockSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

            var blocks = new MemoryMap();

            var lastCharacterParsed = 0;
            var matchResult = void 0;
            var recordCount = 0;

            // Upper Linear Base Address, the 16 most significant bits (2 bytes) of
            // the current 32-bit (4-byte) address
            // In practice this is a offset that is summed to the "load offset" of the
            // data records
            var ulba = 0;

            hexLineRegexp.lastIndex = 0; // Reset the regexp, if not it would skip content when called twice

            while ((matchResult = hexLineRegexp.exec(hexText)) !== null) {
                recordCount++;

                // By default, a regexp loop ignores gaps between matches, but
                // we want to be aware of them.
                if (lastCharacterParsed !== matchResult.index) {
                    throw new Error('Malformed hex file: Could not parse between characters ' + lastCharacterParsed + ' and ' + matchResult.index + ' ("' + hexText.substring(lastCharacterParsed, Math.min(matchResult.index, lastCharacterParsed + 16)).trim() + '")');
                }
                lastCharacterParsed = hexLineRegexp.lastIndex;

                // Give pretty names to the match's capture groups

                var _matchResult = matchResult,
                    _matchResult2 = _slicedToArray(_matchResult, 3),
                    recordStr = _matchResult2[1],
                    recordChecksum = _matchResult2[2];

                // String to Uint8Array - https://stackoverflow.com/questions/43131242/how-to-convert-a-hexademical-string-of-data-to-an-arraybuffer-in-javascript


                var recordBytes = new Uint8Array(recordStr.match(/[\da-f]{2}/gi).map(function (h) {
                    return parseInt(h, 16);
                }));

                var recordLength = recordBytes[0];
                if (recordLength + 4 !== recordBytes.length) {
                    throw new Error('Mismatched record length at record ' + recordCount + ' (' + matchResult[0].trim() + '), expected ' + recordLength + ' data bytes but actual length is ' + (recordBytes.length - 4));
                }

                var cs = checksum(recordBytes);
                if (parseInt(recordChecksum, 16) !== cs) {
                    throw new Error('Checksum failed at record ' + recordCount + ' (' + matchResult[0].trim() + '), should be ' + cs.toString(16));
                }

                var offset = (recordBytes[1] << 8) + recordBytes[2];
                var recordType = recordBytes[3];
                var data = recordBytes.subarray(4);

                if (recordType === 0) {
                    // Data record, contains data
                    // Create a new block, at (upper linear base address + offset)
                    if (blocks.has(ulba + offset)) {
                        throw new Error('Duplicated data at record ' + recordCount + ' (' + matchResult[0].trim() + ')');
                    }
                    if (offset + data.length > 0x10000) {
                        throw new Error('Data at record ' + recordCount + ' (' + matchResult[0].trim() + ') wraps over 0xFFFF. This would trigger ambiguous behaviour. Please restructure your data so that for every record the data offset plus the data length do not exceed 0xFFFF.');
                    }

                    blocks.set(ulba + offset, data);
                } else {

                    // All non-data records must have a data offset of zero
                    if (offset !== 0) {
                        throw new Error('Record ' + recordCount + ' (' + matchResult[0].trim() + ') must have 0000 as data offset.');
                    }

                    switch (recordType) {
                        case 1:
                            // EOF
                            if (lastCharacterParsed !== hexText.length) {
                                // This record should be at the very end of the string
                                throw new Error('There is data after an EOF record at record ' + recordCount);
                            }

                            return blocks.join(maxBlockSize);

                        case 2:
                            // Extended Segment Address Record
                            // Sets the 16 most significant bits of the 20-bit Segment Base
                            // Address for the subsequent data.
                            ulba = (data[0] << 8) + data[1] << 4;
                            break;

                        case 3:
                            // Start Segment Address Record
                            // Do nothing. Record type 3 only applies to 16-bit Intel CPUs,
                            // where it should reset the program counter (CS+IP CPU registers)
                            break;

                        case 4:
                            // Extended Linear Address Record
                            // Sets the 16 most significant (upper) bits of the 32-bit Linear Address
                            // for the subsequent data
                            ulba = (data[0] << 8) + data[1] << 16;
                            break;

                        case 5:
                            // Start Linear Address Record
                            // Do nothing. Record type 5 only applies to 32-bit Intel CPUs,
                            // where it should reset the program counter (EIP CPU register)
                            // It might have meaning for other CPU architectures
                            // (see http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.faqs/ka9903.html )
                            // but will be ignored nonetheless.
                            break;
                        default:
                            throw new Error('Invalid record type 0x' + hexpad(recordType) + ' at record ' + recordCount + ' (should be between 0x00 and 0x05)');
                    }
                }
            }

            if (recordCount) {
                throw new Error('No EOF record at end of file');
            } else {
                throw new Error('Malformed .hex file, could not parse any registers');
            }
        }
    }, {
        key: 'overlapMemoryMaps',
        value: function overlapMemoryMaps(memoryMaps) {
            // First pass: create a list of addresses where any block starts or ends.
            var cuts = new Set();
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = memoryMaps[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _step7$value = _slicedToArray(_step7.value, 2),
                        blocks = _step7$value[1];

                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = blocks[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var _step8$value = _slicedToArray(_step8.value, 2),
                                address = _step8$value[0],
                                block = _step8$value[1];

                            cuts.add(address);
                            cuts.add(address + block.length);
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            var orderedCuts = Array.from(cuts.values()).sort(function (a, b) {
                return a - b;
            });
            var overlaps = new Map();

            // Second pass: iterate through the cuts, get slices of every intersecting blockset

            var _loop = function _loop(i, l) {
                var cut = orderedCuts[i];
                var nextCut = orderedCuts[i + 1];
                var tuples = [];

                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = memoryMaps[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var _step9$value = _slicedToArray(_step9.value, 2),
                            setId = _step9$value[0],
                            blocks = _step9$value[1];

                        // Find the block with the highest address that is equal or lower to
                        // the current cut (if any)
                        var blockAddr = Array.from(blocks.keys()).reduce(function (acc, val) {
                            if (val > cut) {
                                return acc;
                            }
                            return Math.max(acc, val);
                        }, -1);

                        if (blockAddr !== -1) {
                            var block = blocks.get(blockAddr);
                            var subBlockStart = cut - blockAddr;
                            var subBlockEnd = nextCut - blockAddr;

                            if (subBlockStart < block.length) {
                                tuples.push([setId, block.subarray(subBlockStart, subBlockEnd)]);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                if (tuples.length) {
                    overlaps.set(cut, tuples);
                }
            };

            for (var i = 0, l = orderedCuts.length - 1; i < l; i++) {
                _loop(i, l);
            }

            return overlaps;
        }

        /**
         * Given the output of the {@linkcode MemoryMap.overlapMemoryMaps|overlapMemoryMaps}
         * (a <tt>Map</tt> of address to an <tt>Array</tt> of <tt>(id, Uint8Array)</tt> tuples),
         * returns a {@linkcode MemoryMap}. This discards the IDs in the process.
         *<br/>
         * The output <tt>Map</tt> contains as many entries as the input one (using the same addresses
         * as keys), but the value for each entry will be the <tt>Uint8Array</tt> of the <b>last</b>
         * tuple for each address in the input data.
         *<br/>
         * The scenario is wanting to join together several parsed .hex files, not worrying about
         * their overlaps.
         *<br/>
         *
         * @param {Map.Array<mixed,Uint8Array>} overlaps The (possibly overlapping) input memory blocks
         * @return {MemoryMap} The flattened memory blocks
         */

    }, {
        key: 'flattenOverlaps',
        value: function flattenOverlaps(overlaps) {
            return new MemoryMap(Array.from(overlaps.entries()).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    address = _ref2[0],
                    tuples = _ref2[1];

                return [address, tuples[tuples.length - 1][1]];
            }));
        }
    }, {
        key: 'fromPaddedUint8Array',
        value: function fromPaddedUint8Array(bytes) {
            var padByte = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF;
            var minPadLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 64;


            if (!(bytes instanceof Uint8Array)) {
                throw new Error('Bytes passed to fromPaddedUint8Array are not an Uint8Array');
            }

            // The algorithm used is naïve and checks every byte.
            // An obvious optimization would be to implement Boyer-Moore
            // (see https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string_search_algorithm )
            // or otherwise start skipping up to minPadLength bytes when going through a non-pad
            // byte.
            // Anyway, we could expect a lot of cases where there is a majority of pad bytes,
            // and the algorithm should check most of them anyway, so the perf gain is questionable.

            var memMap = new MemoryMap();
            var consecutivePads = 0;
            var lastNonPad = -1;
            var firstNonPad = 0;
            var skippingBytes = false;
            var l = bytes.length;

            for (var addr = 0; addr < l; addr++) {
                var byte = bytes[addr];

                if (byte === padByte) {
                    consecutivePads++;
                    if (consecutivePads >= minPadLength) {
                        // Edge case: ignore writing a zero-length block when skipping
                        // bytes at the beginning of the input
                        if (lastNonPad !== -1) {
                            /// Add the previous block to the result memMap
                            memMap.set(firstNonPad, bytes.subarray(firstNonPad, lastNonPad + 1));
                        }

                        skippingBytes = true;
                    }
                } else {
                    if (skippingBytes) {
                        skippingBytes = false;
                        firstNonPad = addr;
                    }
                    lastNonPad = addr;
                    consecutivePads = 0;
                }
            }

            // At EOF, add the last block if not skipping bytes already (and input not empty)
            if (!skippingBytes && lastNonPad !== -1) {
                memMap.set(firstNonPad, bytes.subarray(firstNonPad, l));
            }

            return memMap;
        }
    }]);

    return MemoryMap;
}();

return MemoryMap;

})));
//# sourceMappingURL=intel-hex.browser.js.map
