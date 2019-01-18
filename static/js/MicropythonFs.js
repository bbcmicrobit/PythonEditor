(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.MicropythonFs = {}));
}(this, function (exports) { 'use strict';

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
    const hexLineRegexp = /:([0-9A-Fa-f]{8,})([0-9A-Fa-f]{2})(?:\r\n|\r|\n|)/g;


    // Takes a Uint8Array as input,
    // Returns an integer in the 0-255 range.
    function checksum(bytes) {
        return (-bytes.reduce((sum, v)=>sum + v, 0)) & 0xFF;
    }

    // Takes two Uint8Arrays as input,
    // Returns an integer in the 0-255 range.
    function checksumTwo(array1, array2) {
        const partial1 = array1.reduce((sum, v)=>sum + v, 0);
        const partial2 = array2.reduce((sum, v)=>sum + v, 0);
        return -( partial1 + partial2 ) & 0xFF;
    }


    // Trivial utility. Converts a number to hex and pads with zeroes up to 2 characters.
    function hexpad(number) {
        return number.toString(16).toUpperCase().padStart(2, '0');
    }


    // Polyfill as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
    Number.isInteger = Number.isInteger || function(value) {
        return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
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
    class MemoryMap {
        /**
         * @param {Iterable} blocks The initial value for the memory blocks inside this
         * <tt>MemoryMap</tt>. All keys must be numeric, and all values must be instances of
         * <tt>Uint8Array</tt>. Optionally it can also be a plain <tt>Object</tt> with
         * only numeric keys.
         */
        constructor(blocks) {
            this._blocks = new Map();

            if (blocks && typeof blocks[Symbol.iterator] === 'function') {
                for (const tuple of blocks) {
                    if (!(tuple instanceof Array) || tuple.length !== 2) {
                        throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
                    }
                    this.set(tuple[0], tuple[1]);
                }
            } else if (typeof blocks === 'object') {
                // Try iterating through the object's keys
                const addrs = Object.keys(blocks);
                for (const addr of addrs) {
                    this.set(parseInt(addr), blocks[addr]);
                }

            } else if (blocks !== undefined && blocks !== null) {
                throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
            }
        }

        set(addr, value) {
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
        get(addr)    { return this._blocks.get(addr);    }
        clear()      { return this._blocks.clear();      }
        delete(addr) { return this._blocks.delete(addr); }
        entries()    { return this._blocks.entries();    }
        forEach(callback, that) { return this._blocks.forEach(callback, that); }
        has(addr)    { return this._blocks.has(addr);    }
        keys()       { return this._blocks.keys();       }
        values()     { return this._blocks.values();     }
        get size()   { return this._blocks.size;         }
        [Symbol.iterator]() { return this._blocks[Symbol.iterator](); }


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
        static fromHex(hexText, maxBlockSize = Infinity) {
            const blocks = new MemoryMap();

            let lastCharacterParsed = 0;
            let matchResult;
            let recordCount = 0;

            // Upper Linear Base Address, the 16 most significant bits (2 bytes) of
            // the current 32-bit (4-byte) address
            // In practice this is a offset that is summed to the "load offset" of the
            // data records
            let ulba = 0;

            hexLineRegexp.lastIndex = 0; // Reset the regexp, if not it would skip content when called twice

            while ((matchResult = hexLineRegexp.exec(hexText)) !== null) {
                recordCount++;

                // By default, a regexp loop ignores gaps between matches, but
                // we want to be aware of them.
                if (lastCharacterParsed !== matchResult.index) {
                    throw new Error(
                        'Malformed hex file: Could not parse between characters ' +
                        lastCharacterParsed +
                        ' and ' +
                        matchResult.index +
                        ' ("' +
                        hexText.substring(lastCharacterParsed, Math.min(matchResult.index, lastCharacterParsed + 16)).trim() +
                        '")');
                }
                lastCharacterParsed = hexLineRegexp.lastIndex;

                // Give pretty names to the match's capture groups
                const [, recordStr, recordChecksum] = matchResult;

                // String to Uint8Array - https://stackoverflow.com/questions/43131242/how-to-convert-a-hexademical-string-of-data-to-an-arraybuffer-in-javascript
                const recordBytes = new Uint8Array(recordStr.match(/[\da-f]{2}/gi).map((h)=>parseInt(h, 16)));

                const recordLength = recordBytes[0];
                if (recordLength + 4 !== recordBytes.length) {
                    throw new Error('Mismatched record length at record ' + recordCount + ' (' + matchResult[0].trim() + '), expected ' + (recordLength) + ' data bytes but actual length is ' + (recordBytes.length - 4));
                }

                const cs = checksum(recordBytes);
                if (parseInt(recordChecksum, 16) !== cs) {
                    throw new Error('Checksum failed at record ' + recordCount + ' (' + matchResult[0].trim() + '), should be ' + cs.toString(16) );
                }

                const offset = (recordBytes[1] << 8) + recordBytes[2];
                const recordType = recordBytes[3];
                const data = recordBytes.subarray(4);

                if (recordType === 0) {
                    // Data record, contains data
                    // Create a new block, at (upper linear base address + offset)
                    if (blocks.has(ulba + offset)) {
                        throw new Error('Duplicated data at record ' + recordCount + ' (' + matchResult[0].trim() + ')');
                    }
                    if (offset + data.length > 0x10000) {
                        throw new Error(
                            'Data at record ' +
                            recordCount +
                            ' (' +
                            matchResult[0].trim() +
                            ') wraps over 0xFFFF. This would trigger ambiguous behaviour. Please restructure your data so that for every record the data offset plus the data length do not exceed 0xFFFF.');
                    }

                    blocks.set( ulba + offset, data );

                } else {

                    // All non-data records must have a data offset of zero
                    if (offset !== 0) {
                        throw new Error('Record ' + recordCount + ' (' + matchResult[0].trim() + ') must have 0000 as data offset.');
                    }

                    switch (recordType) {
                    case 1: // EOF
                        if (lastCharacterParsed !== hexText.length) {
                            // This record should be at the very end of the string
                            throw new Error('There is data after an EOF record at record ' + recordCount);
                        }

                        return blocks.join(maxBlockSize);

                    case 2: // Extended Segment Address Record
                        // Sets the 16 most significant bits of the 20-bit Segment Base
                        // Address for the subsequent data.
                        ulba = ((data[0] << 8) + data[1]) << 4;
                        break;

                    case 3: // Start Segment Address Record
                        // Do nothing. Record type 3 only applies to 16-bit Intel CPUs,
                        // where it should reset the program counter (CS+IP CPU registers)
                        break;

                    case 4: // Extended Linear Address Record
                        // Sets the 16 most significant (upper) bits of the 32-bit Linear Address
                        // for the subsequent data
                        ulba = ((data[0] << 8) + data[1]) << 16;
                        break;

                    case 5: // Start Linear Address Record
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
        join(maxBlockSize = Infinity) {

            // First pass, create a Map of address→length of contiguous blocks
            const sortedKeys = Array.from(this.keys()).sort((a,b)=>a-b);
            const blockSizes = new Map();
            let lastBlockAddr = -1;
            let lastBlockEndAddr = -1;

            for (let i=0,l=sortedKeys.length; i<l; i++) {
                const blockAddr = sortedKeys[i];
                const blockLength = this.get(sortedKeys[i]).length;

                if (lastBlockEndAddr === blockAddr && (lastBlockEndAddr - lastBlockAddr) < maxBlockSize) {
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
            const mergedBlocks = new MemoryMap();
            let mergingBlock;
            let mergingBlockAddr = -1;
            for (let i=0,l=sortedKeys.length; i<l; i++) {
                const blockAddr = sortedKeys[i];
                if (blockSizes.has(blockAddr)) {
                    mergingBlock = new Uint8Array(blockSizes.get(blockAddr));
                    mergedBlocks.set(blockAddr, mergingBlock);
                    mergingBlockAddr = blockAddr;
                }
                mergingBlock.set(this.get(blockAddr), blockAddr - mergingBlockAddr);
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
        static overlapMemoryMaps(memoryMaps) {
            // First pass: create a list of addresses where any block starts or ends.
            const cuts = new Set();
            for (const [, blocks] of memoryMaps) {
                for (const [address, block] of blocks) {
                    cuts.add(address);
                    cuts.add(address + block.length);
                }
            }

            const orderedCuts = Array.from(cuts.values()).sort((a,b)=>a-b);
            const overlaps = new Map();

            // Second pass: iterate through the cuts, get slices of every intersecting blockset
            for (let i=0, l=orderedCuts.length-1; i<l; i++) {
                const cut = orderedCuts[i];
                const nextCut = orderedCuts[i+1];
                const tuples = [];

                for (const [setId, blocks] of memoryMaps) {
                    // Find the block with the highest address that is equal or lower to
                    // the current cut (if any)
                    const blockAddr = Array.from(blocks.keys()).reduce((acc, val)=>{
                        if (val > cut) {
                            return acc;
                        }
                        return Math.max( acc, val );
                    }, -1);

                    if (blockAddr !== -1) {
                        const block = blocks.get(blockAddr);
                        const subBlockStart = cut - blockAddr;
                        const subBlockEnd = nextCut - blockAddr;

                        if (subBlockStart < block.length) {
                            tuples.push([ setId, block.subarray(subBlockStart, subBlockEnd) ]);
                        }
                    }
                }

                if (tuples.length) {
                    overlaps.set(cut, tuples);
                }
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
        static flattenOverlaps(overlaps) {
            return new MemoryMap(
                Array.from(overlaps.entries()).map(([address, tuples]) => {
                    return [address, tuples[tuples.length - 1][1] ];
                })
            );
        }


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
        paginate( pageSize=1024, pad=0xFF) {
            if (pageSize <= 0) {
                throw new Error('Page size must be greater than zero');
            }
            const outPages = new MemoryMap();
            let page;

            const sortedKeys = Array.from(this.keys()).sort((a,b)=>a-b);

            for (let i=0,l=sortedKeys.length; i<l; i++) {
                const blockAddr = sortedKeys[i];
                const block = this.get(blockAddr);
                const blockLength = block.length;
                const blockEnd = blockAddr + blockLength;

                for (let pageAddr = blockAddr - (blockAddr % pageSize); pageAddr < blockEnd; pageAddr += pageSize) {
                    page = outPages.get(pageAddr);
                    if (!page) {
                        page = new Uint8Array(pageSize);
                        page.fill(pad);
                        outPages.set(pageAddr, page);
                    }

                    const offset = pageAddr - blockAddr;
                    let subBlock;
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
        getUint32(offset, littleEndian) {
            const keys = Array.from(this.keys());

            for (let i=0,l=keys.length; i<l; i++) {
                const blockAddr = keys[i];
                const block = this.get(blockAddr);
                const blockLength = block.length;
                const blockEnd = blockAddr + blockLength;

                if (blockAddr <= offset && (offset+4) <= blockEnd) {
                    return (new DataView(block.buffer, offset - blockAddr, 4)).getUint32(0, littleEndian);
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
        asHexString(lineSize = 16) {
            let lowAddress  = 0;    // 16 least significant bits of the current addr
            let highAddress = -1 << 16; // 16 most significant bits of the current addr
            const records = [];
            if (lineSize <=0) {
                throw new Error('Size of record must be greater than zero');
            } else if (lineSize > 255) {
                throw new Error('Size of record must be less than 256');
            }

            // Placeholders
            const offsetRecord = new Uint8Array(6);
            const recordHeader = new Uint8Array(4);

            const sortedKeys = Array.from(this.keys()).sort((a,b)=>a-b);
            for (let i=0,l=sortedKeys.length; i<l; i++) {
                const blockAddr = sortedKeys[i];
                const block = this.get(blockAddr);

                // Sanity checks
                if (!(block instanceof Uint8Array)) {
                    throw new Error('Block at offset ' + blockAddr + ' is not an Uint8Array');
                }
                if (blockAddr < 0) {
                    throw new Error('Block at offset ' + blockAddr + ' has a negative thus invalid address');
                }
                const blockSize = block.length;
                if (!blockSize) { continue; }   // Skip zero-length blocks


                if (blockAddr > (highAddress + 0xFFFF)) {
                    // Insert a new 0x04 record to jump to a new 64KiB block

                    // Round up the least significant 16 bits - no bitmasks because they trigger
                    // base-2 negative numbers, whereas subtracting the modulo maintains precision
                    highAddress = blockAddr - blockAddr % 0x10000;
                    lowAddress = 0;

                    offsetRecord[0] = 2;    // Length
                    offsetRecord[1] = 0;    // Load offset, high byte
                    offsetRecord[2] = 0;    // Load offset, low byte
                    offsetRecord[3] = 4;    // Record type
                    offsetRecord[4] = highAddress >> 24;    // new address offset, high byte
                    offsetRecord[5] = highAddress >> 16;    // new address offset, low byte

                    records.push(
                        ':' +
                        Array.prototype.map.call(offsetRecord, hexpad).join('') +
                        hexpad(checksum(offsetRecord))
                    );
                }

                if (blockAddr < (highAddress + lowAddress)) {
                    throw new Error(
                        'Block starting at 0x' +
                        blockAddr.toString(16) +
                        ' overlaps with a previous block.');
                }

                lowAddress = blockAddr % 0x10000;
                let blockOffset = 0;
                const blockEnd = blockAddr + blockSize;
                if (blockEnd > 0xFFFFFFFF) {
                    throw new Error('Data cannot be over 0xFFFFFFFF');
                }

                // Loop for every 64KiB memory segment that spans this block
                while (highAddress + lowAddress < blockEnd) {

                    if (lowAddress > 0xFFFF) {
                        // Insert a new 0x04 record to jump to a new 64KiB block
                        highAddress += 1 << 16; // Increase by one
                        lowAddress = 0;

                        offsetRecord[0] = 2;    // Length
                        offsetRecord[1] = 0;    // Load offset, high byte
                        offsetRecord[2] = 0;    // Load offset, low byte
                        offsetRecord[3] = 4;    // Record type
                        offsetRecord[4] = highAddress >> 24;    // new address offset, high byte
                        offsetRecord[5] = highAddress >> 16;    // new address offset, low byte

                        records.push(
                            ':' +
                            Array.prototype.map.call(offsetRecord, hexpad).join('') +
                            hexpad(checksum(offsetRecord))
                        );
                    }

                    let recordSize = -1;
                    // Loop for every record for that spans the current 64KiB memory segment
                    while (lowAddress < 0x10000 && recordSize) {
                        recordSize = Math.min(
                            lineSize,                            // Normal case
                            blockEnd - highAddress - lowAddress, // End of block
                            0x10000 - lowAddress                 // End of low addresses
                        );

                        if (recordSize) {

                            recordHeader[0] = recordSize;   // Length
                            recordHeader[1] = lowAddress >> 8;    // Load offset, high byte
                            recordHeader[2] = lowAddress;    // Load offset, low byte
                            recordHeader[3] = 0;    // Record type

                            const subBlock = block.subarray(blockOffset, blockOffset + recordSize);   // Data bytes for this record

                            records.push(
                                ':' +
                                Array.prototype.map.call(recordHeader, hexpad).join('') +
                                Array.prototype.map.call(subBlock, hexpad).join('') +
                                hexpad(checksumTwo(recordHeader, subBlock))
                            );

                            blockOffset += recordSize;
                            lowAddress += recordSize;
                        }
                    }
                }
            }

            records.push(':00000001FF');    // EOF record

            return records.join('\n');
        }


        /**
         * Performs a deep copy of the current {@linkcode MemoryMap}, returning a new one
         * with exactly the same contents, but allocating new memory for each of its
         * <tt>Uint8Array</tt>s.
         *
         * @return {MemoryMap}
         */
        clone() {
            const cloned = new MemoryMap();

            for (let [addr, value] of this) {
                cloned.set(addr, new Uint8Array(value));
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
        static fromPaddedUint8Array(bytes, padByte=0xFF, minPadLength=64) {

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

            const memMap = new MemoryMap();
            let consecutivePads = 0;
            let lastNonPad = -1;
            let firstNonPad = 0;
            let skippingBytes = false;
            const l = bytes.length;

            for (let addr = 0; addr < l; addr++) {
                const byte = bytes[addr];

                if (byte === padByte) {
                    consecutivePads++;
                    if (consecutivePads >= minPadLength) {
                        // Edge case: ignore writing a zero-length block when skipping
                        // bytes at the beginning of the input
                        if (lastNonPad !== -1) {
                            /// Add the previous block to the result memMap
                            memMap.set(firstNonPad, bytes.subarray(firstNonPad, lastNonPad+1));
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
        slice(address, length = Infinity){
            if (length < 0) {
                throw new Error('Length of the slice cannot be negative');
            }

            const sliced = new MemoryMap();

            for (let [blockAddr, block] of this) {
                const blockLength = block.length;

                if ((blockAddr + blockLength) >= address && blockAddr < (address + length)) {
                    const sliceStart = Math.max(address, blockAddr);
                    const sliceEnd = Math.min(address + length, blockAddr + blockLength);
                    const sliceLength = sliceEnd - sliceStart;
                    const relativeSliceStart = sliceStart - blockAddr;

                    if (sliceLength > 0) {
                        sliced.set(sliceStart, block.subarray(relativeSliceStart, relativeSliceStart + sliceLength));
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
        slicePad(address, length, padByte=0xFF){
            if (length < 0) {
                throw new Error('Length of the slice cannot be negative');
            }
            
            const out = (new Uint8Array(length)).fill(padByte);

            for (let [blockAddr, block] of this) {
                const blockLength = block.length;

                if ((blockAddr + blockLength) >= address && blockAddr < (address + length)) {
                    const sliceStart = Math.max(address, blockAddr);
                    const sliceEnd = Math.min(address + length, blockAddr + blockLength);
                    const sliceLength = sliceEnd - sliceStart;
                    const relativeSliceStart = sliceStart - blockAddr;

                    if (sliceLength > 0) {
                        out.set(block.subarray(relativeSliceStart, relativeSliceStart + sliceLength), sliceStart - address);
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
        contains(memMap) {
            for (let [blockAddr, block] of memMap) {

                const blockLength = block.length;

                const slice = this.slice(blockAddr, blockLength).join().get(blockAddr);

                if ((!slice) || slice.length !== blockLength ) {
                    return false;
                }

                for (const i in block) {
                    if (block[i] !== slice[i]) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    /**
     * General utilities.
     */
    /**
     * String placed inside the MicroPython hex string to indicate where to
     * paste the Python Code
     */
    var HEX_INSERTION_POINT = ':::::::::::::::::::::::::::::::::::::::::::\n';
    /**
     * Removes the old insertion line the input Intel Hex string contains it.
     * @param intelHex String with the intel hex lines.
     * @returns The Intel Hex string without insertion line.
     */
    function cleanseOldHexFormat(intelHex) {
        return intelHex.replace(HEX_INSERTION_POINT, '');
    }
    /**
     * Converts a string into a byte array of characters.
     * TODO: Update to encode to UTF-8 correctly.
     * @param str - String to convert to bytes.
     * @returns A byte array with the encoded data.
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
     * @param byteArray - Array of bytes to convert.
     * @returns String output from the conversion.
     */
    function bytesToStr(byteArray) {
        var result = [];
        byteArray.forEach(function (element) { return result.push(String.fromCharCode(element)); });
        return result.join('');
    }

    /**
     * Module to add and remove Python scripts into and from a MicroPython hex.
     */
    /** How many bytes per Intel Hex record line. */
    var HEX_RECORD_DATA_LEN = 16;
    /**
     * Parses through an Intel Hex string to find the Python code at the
     * allocated address and extracts it.
     * @param intelHex - Intel Hex block to scan for the code.
     * @return Python code.
     */
    function getScriptFromIntelHex(intelHex) {
        var pyCode = '';
        var hexFileMemMap = MemoryMap.fromHex(intelHex);
        // Check that the known flash location has user code
        if (hexFileMemMap.has(253952 /* StartAdd */)) {
            var pyCodeMemMap = hexFileMemMap.slice(253952 /* StartAdd */, 8192 /* Length */);
            var codeBytes = pyCodeMemMap.get(253952 /* StartAdd */);
            if (codeBytes[0 /* HeaderStartByte0Index */] ===
                77 /* HeaderStartByte0 */ &&
                codeBytes[1 /* HeaderStartByte1Index */] ===
                    80 /* HeaderStartByte1 */) {
                pyCode = bytesToStr(codeBytes.slice(4 /* HeaderLength */));
                // Clean null terminators at the end
                pyCode = pyCode.replace(/\0/g, '');
            }
        }
        return pyCode;
    }
    /**
     * When the user code is inserted into the flash known location it needs to be
     * packed with a header. This function outputs a byte array with a fully formed
     * User Code Block.
     * @param dataBytes Array of bytes to include in the User Code block.
     * @returns Byte array with the full User Code Block.
     */
    function createUserCodeBlock(dataBytes) {
        var blockLength = dataBytes.length + 4 /* HeaderLength */;
        // Old DAPLink versions need padding on the last record to fill the line
        blockLength += HEX_RECORD_DATA_LEN - (blockLength % HEX_RECORD_DATA_LEN);
        var blockBytes = new Uint8Array(blockLength).fill(0x00);
        // The user script block has to start with "MP" marker + script length
        blockBytes[0] = 77 /* HeaderStartByte0 */;
        blockBytes[1] = 80 /* HeaderStartByte1 */;
        blockBytes[2] = dataBytes.length & 0xff;
        blockBytes[3] = (dataBytes.length >> 8) & 0xff;
        blockBytes.set(dataBytes, 4 /* HeaderLength */);
        return blockBytes;
    }
    /**
     * Converts the Python code into the Intel Hex format expected by
     * MicroPython and injects it into a Intel Hex string containing a marker.
     * @param intelHex - Single string of Intel Hex records to inject the code.
     * @param pyStr - Python code string.
     * @returns Intel Hex string with the Python code injected.
     */
    function appendScriptToIntelHex(intelHex, pyCode) {
        var codeBytes = strToBytes(pyCode);
        var blockBytes = createUserCodeBlock(codeBytes);
        if (blockBytes.length > 8192 /* Length */) {
            throw new RangeError('Too long');
        }
        // Convert to Intel Hex format
        var intelHexClean = cleanseOldHexFormat(intelHex);
        var intelHexMap = MemoryMap.fromHex(intelHexClean);
        intelHexMap.set(253952 /* StartAdd */, blockBytes);
        // Older versions of DAPLink need the file to end in a new line
        return intelHexMap.asHexString() + '\n';
    }
    /**
     * Checks the Intel Hex memory map to see if there is an appended script.
     *
     * TODO: Actually implement this.
     * At the moment the test version of the Python Editor also appends the script
     * so that it is still readable by the editor.
     * @param intelHexMap - Memory map for the MicroPython Intel Hex.
     * @returns True if script is present, false otherwise.
     */
    function isAppendedScriptPresent(intelHexMap) {
        return true;
    }

    /** Flash values for the micro:bit nRF microcontroller. */
    var FLASH_PAGE_SIZE = 1024;
    var FLASH_END = 0x40000;
    /** Size of pages with specific functions. */
    var CALIBRATION_PAGE_SIZE = FLASH_PAGE_SIZE;
    // ----------------------------------------------------------------------------
    // Temporary maintained state pointing to the next available chunk.
    // TODO: Remove once nextAvailableChunk() is updated.
    // Chosen by fair dice roll, guaranteed to be random.
    var FS_START_CHUNK = 0x01;
    var FS_NEXT_AVAILABLE_CHUNK = FS_START_CHUNK;
    function fsIncreaseChunkIndex(numberOfChunks) {
        FS_NEXT_AVAILABLE_CHUNK += numberOfChunks;
        var unusedMap = new MemoryMap();
        // Check if we are over the filesystem area
        if (chuckIndexAddress(unusedMap, FS_NEXT_AVAILABLE_CHUNK) >=
            getEndAddress(unusedMap)) {
            throw new Error('There is no more space in the file system.');
        }
    }
    // ----------------------------------------------------------------------------
    /**
     * Navigate through the Intel Hex memory map scanning through the file system
     * and finding the next available chunk.
     *
     * TODO: Update to scan input hex.
     * @param intelHexMap
     * @returns Next available filesystem chunk.
     */
    function nextAvailableChunk(intelHexMap) {
        // TODO: Check if we have run out of memory.
        return FS_NEXT_AVAILABLE_CHUNK;
    }
    /**
     * Calculates from the input Intel Hex where the MicroPython runtime ends and
     * return that as the start of the filesystem area.
     *
     * TODO: Actually calculate this.
     * @param intelHexMap
     * @returns Filesystem start address
     */
    function getStartAddress(intelHexMap) {
        // TODO: For this first implementation the start address is manually
        // calculated and written down here.
        return 0x38c00;
    }
    /**
     * Calculates the end address for the filesystem.
     *
     * Start from the end of flash or from the top of appended script if
     * one is included in the Intel Hex data.
     * Then one page is used at the end of this space for the magnetometer
     * calibration data, and one page by the filesystem as the persistent page.
     * @param intelHexMap - Memory map for the MicroPython Intel Hex.
     * @returns End address for the filesystem.
     */
    function getEndAddress(intelHexMap) {
        var endAddress = FLASH_END;
        // TODO: isAppendedScriptPresent is not yet implemented
        {
            endAddress = 253952 /* StartAdd */;
        }
        return endAddress - CALIBRATION_PAGE_SIZE;
    }
    /**
     * Calculates the address for the last page available to the filesystem.
     * @param intelHexMap - Memory map for the MicroPython Intel Hex.
     * @returns Memory address where the last filesystem page starts.
     */
    function getLastPageAddress(intelHexMap) {
        return getEndAddress(intelHexMap) - FLASH_PAGE_SIZE;
    }
    /**
     * Get the start address for the persistent page in flash.
     *
     * This page is located right below the end of the filesystem space.
     * @param intelHexMap - Memory map for the MicroPython Intel Hex.
     * @returns Start address for the filesystem persistent page.
     */
    function getPersistentPageAddress(intelHexMap) {
        // TODO: This could be the first or the last page. Randomise if it doesn't
        // exists.
        return getLastPageAddress(intelHexMap);
    }
    /**
     * Calculate the flash memory address from the chunk index.
     * @param intelHexMap - Memory map for the MicroPython Intel Hex.
     * @param chunkIndex - Index for the chunk to calculate.
     * @returns Address in flash for the chunk.
     */
    function chuckIndexAddress(intelHexMap, chunkIndex) {
        // Chunk index starts at 1, so we need to account for that in the calculation
        return getStartAddress(intelHexMap) + (chunkIndex - 1) * 128 /* All */;
    }
    /** Contain file data and create its filesystem representation. */
    var FsFile = /** @class */ (function () {
        function FsFile(filename, data) {
            this._filename = filename;
            this._dataBytes = data;
            // Generate a single byte array with the filesystem data bytes.
            var fileHeader = this.generateFileHeaderBytes();
            this._fsDataBytes = new Uint8Array(fileHeader.length + this._dataBytes.length);
            this._fsDataBytes.set(fileHeader, 0);
            this._fsDataBytes.set(this._dataBytes, fileHeader.length);
        }
        /**
         * Generates a byte array for the file header as expected by the MicroPython
         * file system.
         * @return Byte array with the header data.
         */
        FsFile.prototype.generateFileHeaderBytes = function () {
            var headerSize = 1 /* EndOffset */ + 1 /* NameLength */ + this._filename.length;
            var endOffset = (headerSize + this._dataBytes.length) % 126 /* Data */;
            var fileNameOffset = headerSize - this._filename.length;
            // Format header byte array
            var headerBytes = new Uint8Array(headerSize);
            headerBytes[1 /* EndOffset */ - 1] = endOffset;
            headerBytes[2 /* NameLength */ - 1] = this._filename.length;
            for (var i = fileNameOffset; i < headerSize; ++i) {
                // TODO: use strToBytes instead
                headerBytes[i] = this._filename.charCodeAt(i - fileNameOffset);
            }
            return headerBytes;
        };
        /**
         * Takes a file name and a byte array of data to add to the file system, and
         * converts it into an array of file system chunks, each a byte array.
         * @param chunkIndex - Index of the first chunk where this data will be
         *         stored.
         * @returns An array of byte arrays, one item per chunk.
         */
        FsFile.prototype.getFsChunks = function (chunkIndex) {
            // Now form the chunks
            var chunks = [];
            var dataIndex = 0;
            // First case is an exception, where the marker indicates file start
            var chunk = new Uint8Array(128 /* All */).fill(0xff);
            chunk[0 /* Marker */] = 254 /* FileStart */;
            var loopEnd = Math.min(this._fsDataBytes.length, 126 /* Data */);
            for (var i = 0; i < loopEnd; i++, dataIndex++) {
                chunk[1 /* Marker */ + i] = this._fsDataBytes[dataIndex];
            }
            chunks.push(chunk);
            // The rest follow the same pattern
            while (dataIndex < this._fsDataBytes.length) {
                chunk = new Uint8Array(128 /* All */).fill(0xff);
                // This chunk points to the previous, increase index for this chunk
                chunk[0 /* Marker */] = chunkIndex++;
                // At each loop iteration we know the previous chunk has to be
                // followed by this one, so add this index to the previous
                // chunk "next chunk" field at the tail
                chunks[chunks.length - 1][127 /* Tail */] = chunkIndex;
                // Add the data to this chunk
                loopEnd = Math.min(this._fsDataBytes.length - dataIndex, 126 /* Data */);
                for (var i = 0; i < loopEnd; i++, dataIndex++) {
                    chunk[1 /* Marker */ + i] = this._fsDataBytes[dataIndex];
                }
                chunks.push(chunk);
            }
            return chunks;
        };
        FsFile.prototype.getFsBytes = function (chunkIndex) {
            var chunks = this.getFsChunks(chunkIndex);
            // TODO: remove the need to do this
            fsIncreaseChunkIndex(chunks.length);
            var chunksLen = chunks.length * 128 /* All */;
            var fileFsBytes = new Uint8Array(chunksLen);
            // tslint:disable-next-line:prefer-for-of
            for (var i = 0; i < chunks.length; i++) {
                fileFsBytes.set(chunks[i], 128 /* All */ * i);
            }
            return fileFsBytes;
        };
        return FsFile;
    }());
    function addFileToIntelHex(intelHex, filename, data) {
        // Do nothing if there is no files to add
        if (!filename || !data.length) {
            // TODO: Throw error
            return intelHex;
        }
        var intelHexClean = cleanseOldHexFormat(intelHex);
        var intelHexMap = MemoryMap.fromHex(intelHexClean);
        // Find next available chunk and its flash address
        var chunkIndex = nextAvailableChunk(intelHexMap);
        var startAddress = chuckIndexAddress(intelHexMap, chunkIndex);
        // Store in an array each file converted to file system chunks
        var fsFile = new FsFile(filename, data);
        var fileFsBytes = fsFile.getFsBytes(chunkIndex);
        // Add files to Intel Hex, including the persistent page marker.
        intelHexMap.set(startAddress, fileFsBytes);
        intelHexMap.set(getPersistentPageAddress(intelHexMap), new Uint8Array([253 /* PersistentData */]));
        return intelHexMap.asHexString() + '\n';
    }

    var SimpleFile = /** @class */ (function () {
        function SimpleFile(filename, data) {
            this.filename = filename;
            if (typeof data === 'string') {
                this._dataBytes = strToBytes(data);
            }
            else {
                this._dataBytes = data;
            }
        }
        SimpleFile.prototype.getText = function () {
            return bytesToStr(this._dataBytes);
        };
        SimpleFile.prototype.getBytes = function () {
            return this._dataBytes;
        };
        return SimpleFile;
    }());
    // TODO: Max filename size
    // tslint:disable-next-line:max-classes-per-file
    var FileSystem = /** @class */ (function () {
        function FileSystem(intelHex) {
            this._files = {};
            this._intelHex = intelHex;
            // TODO: Read present file system in Intel Hex and populate files here
        }
        FileSystem.prototype.write = function (filename, content) {
            this._files[filename] = new SimpleFile(filename, content);
        };
        FileSystem.prototype.append = function (filename, content) {
            // TODO: Append content to existing file
            // TODO: Do we throw error if file does not exists, or create it?
            // tslint:disable-next-line:no-console
            console.log('append() method unimplemented.');
        };
        FileSystem.prototype.read = function (filename) {
            // TODO: Own error message when file does not exists
            return this._files[filename].getText();
        };
        FileSystem.prototype.readBytes = function (filename) {
            // TODO: Own error message when file does not exists
            return this._files[filename].getBytes();
        };
        FileSystem.prototype.remove = function (filename) {
            // TODO: Check if file exists first
            delete this._files[filename];
        };
        FileSystem.prototype.exists = function (filename) {
            return this._files.hasOwnProperty(filename);
        };
        FileSystem.prototype.ls = function () {
            var files = [];
            Object.values(this._files).forEach(function (value) { return files.push(value.filename); });
            return files;
        };
        FileSystem.prototype.getIntelHex = function () {
            var finalHex = this._intelHex;
            Object.values(this._files).forEach(function (file) {
                finalHex = addFileToIntelHex(finalHex, file.filename, file.getBytes());
            });
            return finalHex;
        };
        return FileSystem;
    }());

    exports.appendScriptToIntelHex = appendScriptToIntelHex;
    exports.getScriptFromIntelHex = getScriptFromIntelHex;
    exports.isAppendedScriptPresent = isAppendedScriptPresent;
    exports.FileSystem = FileSystem;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
