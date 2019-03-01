(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.microbitFs = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

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
  var hexLineRegexp = /:([0-9A-Fa-f]{8,})([0-9A-Fa-f]{2})(?:\r\n|\r|\n|)/g; // Takes a Uint8Array as input,
  // Returns an integer in the 0-255 range.

  function checksum(bytes) {
    return -bytes.reduce(function (sum, v) {
      return sum + v;
    }, 0) & 0xFF;
  } // Takes two Uint8Arrays as input,
  // Returns an integer in the 0-255 range.


  function checksumTwo(array1, array2) {
    var partial1 = array1.reduce(function (sum, v) {
      return sum + v;
    }, 0);
    var partial2 = array2.reduce(function (sum, v) {
      return sum + v;
    }, 0);
    return -(partial1 + partial2) & 0xFF;
  } // Trivial utility. Converts a number to hex and pads with zeroes up to 2 characters.


  function hexpad(number) {
    return number.toString(16).toUpperCase().padStart(2, '0');
  } // Polyfill as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger


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


  var MemoryMap =
  /*#__PURE__*/
  function () {
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
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else if (_typeof(blocks) === 'object') {
        // Try iterating through the object's keys
        var addrs = Object.keys(blocks);

        for (var _i = 0; _i < addrs.length; _i++) {
          var addr = addrs[_i];
          this.set(parseInt(addr), blocks[addr]);
        }
      } else if (blocks !== undefined && blocks !== null) {
        throw new Error('First parameter to MemoryMap constructor must be an iterable of [addr, bytes] or undefined');
      }
    }

    _createClass(MemoryMap, [{
      key: "set",
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
      } // Delegate the following to the 'this._blocks' Map:

    }, {
      key: "get",
      value: function get(addr) {
        return this._blocks.get(addr);
      }
    }, {
      key: "clear",
      value: function clear() {
        return this._blocks.clear();
      }
    }, {
      key: "delete",
      value: function _delete(addr) {
        return this._blocks.delete(addr);
      }
    }, {
      key: "entries",
      value: function entries() {
        return this._blocks.entries();
      }
    }, {
      key: "forEach",
      value: function forEach(callback, that) {
        return this._blocks.forEach(callback, that);
      }
    }, {
      key: "has",
      value: function has(addr) {
        return this._blocks.has(addr);
      }
    }, {
      key: "keys",
      value: function keys() {
        return this._blocks.keys();
      }
    }, {
      key: "values",
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
      key: "join",

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
        } // Second pass: allocate memory for the contiguous blocks and copy data around.


        var mergedBlocks = new MemoryMap();
        var mergingBlock;
        var mergingBlockAddr = -1;

        for (var _i2 = 0, _l = sortedKeys.length; _i2 < _l; _i2++) {
          var _blockAddr = sortedKeys[_i2];

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
      key: "paginate",

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
        var page;
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
      key: "getUint32",
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
      key: "asHexString",
      value: function asHexString() {
        var lineSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
        var lowAddress = 0; // 16 least significant bits of the current addr

        var highAddress = -1 << 16; // 16 most significant bits of the current addr

        var records = [];

        if (lineSize <= 0) {
          throw new Error('Size of record must be greater than zero');
        } else if (lineSize > 255) {
          throw new Error('Size of record must be less than 256');
        } // Placeholders


        var offsetRecord = new Uint8Array(6);
        var recordHeader = new Uint8Array(4);
        var sortedKeys = Array.from(this.keys()).sort(function (a, b) {
          return a - b;
        });

        for (var i = 0, l = sortedKeys.length; i < l; i++) {
          var blockAddr = sortedKeys[i];
          var block = this.get(blockAddr); // Sanity checks

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
          } // Loop for every 64KiB memory segment that spans this block


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

            var recordSize = -1; // Loop for every record for that spans the current 64KiB memory segment

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
      key: "clone",
      value: function clone() {
        var cloned = new MemoryMap();
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                addr = _step2$value[0],
                value = _step2$value[1];

            cloned.set(addr, new Uint8Array(value));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
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
      key: "slice",

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
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                blockAddr = _step3$value[0],
                block = _step3$value[1];

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
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
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
      key: "slicePad",
      value: function slicePad(address, length) {
        var padByte = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xFF;

        if (length < 0) {
          throw new Error('Length of the slice cannot be negative');
        }

        var out = new Uint8Array(length).fill(padByte);
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
                out.set(block.subarray(relativeSliceStart, relativeSliceStart + sliceLength), sliceStart - address);
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
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
      key: "contains",
      value: function contains(memMap) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = memMap[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _step5$value = _slicedToArray(_step5.value, 2),
                blockAddr = _step5$value[0],
                block = _step5$value[1];

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
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return true;
      }
    }, {
      key: "size",
      get: function get() {
        return this._blocks.size;
      }
    }], [{
      key: "fromHex",
      value: function fromHex(hexText) {
        var maxBlockSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
        var blocks = new MemoryMap();
        var lastCharacterParsed = 0;
        var matchResult;
        var recordCount = 0; // Upper Linear Base Address, the 16 most significant bits (2 bytes) of
        // the current 32-bit (4-byte) address
        // In practice this is a offset that is summed to the "load offset" of the
        // data records

        var ulba = 0;
        hexLineRegexp.lastIndex = 0; // Reset the regexp, if not it would skip content when called twice

        while ((matchResult = hexLineRegexp.exec(hexText)) !== null) {
          recordCount++; // By default, a regexp loop ignores gaps between matches, but
          // we want to be aware of them.

          if (lastCharacterParsed !== matchResult.index) {
            throw new Error('Malformed hex file: Could not parse between characters ' + lastCharacterParsed + ' and ' + matchResult.index + ' ("' + hexText.substring(lastCharacterParsed, Math.min(matchResult.index, lastCharacterParsed + 16)).trim() + '")');
          }

          lastCharacterParsed = hexLineRegexp.lastIndex; // Give pretty names to the match's capture groups

          var _matchResult = matchResult,
              _matchResult2 = _slicedToArray(_matchResult, 3),
              recordStr = _matchResult2[1],
              recordChecksum = _matchResult2[2]; // String to Uint8Array - https://stackoverflow.com/questions/43131242/how-to-convert-a-hexademical-string-of-data-to-an-arraybuffer-in-javascript


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
      key: "overlapMemoryMaps",
      value: function overlapMemoryMaps(memoryMaps) {
        // First pass: create a list of addresses where any block starts or ends.
        var cuts = new Set();
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = memoryMaps[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _step6$value = _slicedToArray(_step6.value, 2),
                blocks = _step6$value[1];

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = blocks[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _step7$value = _slicedToArray(_step7.value, 2),
                    address = _step7$value[0],
                    block = _step7$value[1];

                cuts.add(address);
                cuts.add(address + block.length);
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        var orderedCuts = Array.from(cuts.values()).sort(function (a, b) {
          return a - b;
        });
        var overlaps = new Map(); // Second pass: iterate through the cuts, get slices of every intersecting blockset

        var _loop = function _loop(i, l) {
          var cut = orderedCuts[i];
          var nextCut = orderedCuts[i + 1];
          var tuples = [];
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = memoryMaps[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var _step8$value = _slicedToArray(_step8.value, 2),
                  setId = _step8$value[0],
                  blocks = _step8$value[1];

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
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
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
      key: "flattenOverlaps",
      value: function flattenOverlaps(overlaps) {
        return new MemoryMap(Array.from(overlaps.entries()).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              address = _ref2[0],
              tuples = _ref2[1];

          return [address, tuples[tuples.length - 1][1]];
        }));
      }
    }, {
      key: "fromPaddedUint8Array",
      value: function fromPaddedUint8Array(bytes) {
        var padByte = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF;
        var minPadLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 64;

        if (!(bytes instanceof Uint8Array)) {
          throw new Error('Bytes passed to fromPaddedUint8Array are not an Uint8Array');
        } // The algorithm used is naïve and checks every byte.
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
        } // At EOF, add the last block if not skipping bytes already (and input not empty)


        if (!skippingBytes && lastNonPad !== -1) {
          memMap.set(firstNonPad, bytes.subarray(firstNonPad, l));
        }

        return memMap;
      }
    }]);

    return MemoryMap;
  }();

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var textEncoderLite = createCommonjsModule(function (module) {
    function TextEncoderLite() {}

    function TextDecoderLite() {}

    (function () {
      // Thanks Feross et al! :-)

      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        var i = 0;

        for (; i < length; i++) {
          codePoint = string.charCodeAt(i); // is surrogate component

          if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (leadSurrogate) {
              // 2 leads in a row
              if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
              } else {
                // valid surrogate pair
                codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
                leadSurrogate = null;
              }
            } else {
              // no lead yet
              if (codePoint > 0xDBFF) {
                // unexpected trail
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              } else if (i + 1 === length) {
                // unpaired lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              } else {
                // valid lead
                leadSurrogate = codePoint;
                continue;
              }
            }
          } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            leadSurrogate = null;
          } // encode utf8


          if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x200000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else {
            throw new Error('Invalid code point');
          }
        }

        return bytes;
      }

      function utf8Slice(buf, start, end) {
        var res = '';
        var tmp = '';
        end = Math.min(buf.length, end || Infinity);
        start = start || 0;

        for (var i = start; i < end; i++) {
          if (buf[i] <= 0x7F) {
            res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
            tmp = '';
          } else {
            tmp += '%' + buf[i].toString(16);
          }
        }

        return res + decodeUtf8Char(tmp);
      }

      function decodeUtf8Char(str) {
        try {
          return decodeURIComponent(str);
        } catch (err) {
          return String.fromCharCode(0xFFFD); // UTF 8 invalid char
        }
      }

      TextEncoderLite.prototype.encode = function (str) {
        var result;

        if ('undefined' === typeof Uint8Array) {
          result = utf8ToBytes(str);
        } else {
          result = new Uint8Array(utf8ToBytes(str));
        }

        return result;
      };

      TextDecoderLite.prototype.decode = function (bytes) {
        return utf8Slice(bytes, 0, bytes.length);
      };
    })();

    if (module) {
      TextDecoderLite.TextDecoderLite = TextDecoderLite;
      TextDecoderLite.TextEncoderLite = TextEncoderLite;
      module.exports.TextDecoderLite = TextDecoderLite;
      module.exports.TextEncoderLite = TextEncoderLite;
      module.exports = TextDecoderLite;
    }
  });
  var textEncoderLite_1 = textEncoderLite.TextDecoderLite;
  var textEncoderLite_2 = textEncoderLite.TextEncoderLite;

  /**
   * General utilities.
   */
  /**
   * Marker placed inside the MicroPython hex string to indicate where to
   * inject the user Python Code.
   */

  var HEX_INSERTION_POINT = ':::::::::::::::::::::::::::::::::::::::::::\n';
  /**
   * Removes the old insertion line the input Intel Hex string contains it.
   *
   * @param intelHex - String with the intel hex lines.
   * @returns The Intel Hex string without insertion line.
   */

  function cleanseOldHexFormat(intelHex) {
    return intelHex.replace(HEX_INSERTION_POINT, '');
  }
  /**
   * Converts a string into a byte array of characters.
   * @param str - String to convert to bytes.
   * @returns A byte array with the encoded data.
   */

  function strToBytes(str) {
    var encoder = new textEncoderLite_2();
    return encoder.encode(str);
  }
  /**
   * Converts a byte array into a string of characters.
   * @param byteArray - Array of bytes to convert.
   * @returns String output from the conversion.
   */

  function bytesToStr(byteArray) {
    var decoder = new textEncoderLite_1();
    return decoder.decode(byteArray);
  }
  /**
   * Concatenates two Uint8Arrays.
   *
   * @param first - The first array to concatenate.
   * @param second - The second array to concatenate.
   * @returns New array with both inputs concatenated.
   */

  var concatUint8Array = function concatUint8Array(first, second) {
    var combined = new Uint8Array(first.length + second.length);
    combined.set(first);
    combined.set(second, first.length);
    return combined;
  };

  /**
   * Module to add and remove Python scripts into and from a MicroPython hex.
   */
  /** Start of user script marked by "MP" + 2 bytes for the script length. */

  var HEADER_START_BYTE_0 = 77; // 'M'

  var HEADER_START_BYTE_1 = 80; // 'P'

  /** How many bytes per Intel Hex record line. */

  var HEX_RECORD_DATA_LEN = 16;
  /**
   * Parses through an Intel Hex string to find the Python code at the
   * allocated address and extracts it.
   *
   * @param intelHex - Intel Hex block to scan for the code.
   * @return Python code.
   */

  function getIntelHexAppendedScript(intelHex) {
    var pyCode = '';
    var hexFileMemMap = MemoryMap.fromHex(intelHex); // Check that the known flash location has user code

    if (hexFileMemMap.has(253952
    /* StartAdd */
    )) {
      var pyCodeMemMap = hexFileMemMap.slice(253952
      /* StartAdd */
      , 8192
      /* Length */
      );
      var codeBytes = pyCodeMemMap.get(253952
      /* StartAdd */
      );

      if (codeBytes[0
      /* Byte0 */
      ] === HEADER_START_BYTE_0 && codeBytes[1
      /* Byte1 */
      ] === HEADER_START_BYTE_1) {
        pyCode = bytesToStr(codeBytes.slice(4
        /* Length */
        )); // Clean null terminators at the end

        pyCode = pyCode.replace(/\0/g, '');
      }
    }

    return pyCode;
  }
  /**
   * When the user code is inserted into the flash known location it needs to be
   * packed with a header. This function outputs a byte array with a fully formed
   * User Code Block.
   *
   * @param dataBytes - Array of bytes to include in the User Code block.
   * @returns Byte array with the full User Code Block.
   */


  function createAppendedBlock(dataBytes) {
    var blockLength = dataBytes.length + 4
    /* Length */
    ; // Old DAPLink versions need padding on the last record to fill the line

    if (blockLength % HEX_RECORD_DATA_LEN) {
      blockLength += HEX_RECORD_DATA_LEN - blockLength % HEX_RECORD_DATA_LEN;
    }

    var blockBytes = new Uint8Array(blockLength).fill(0x00); // The user script block has to start with "MP" marker + script length

    blockBytes[0] = HEADER_START_BYTE_0;
    blockBytes[1] = HEADER_START_BYTE_1;
    blockBytes[2] = dataBytes.length & 0xff;
    blockBytes[3] = dataBytes.length >> 8 & 0xff;
    blockBytes.set(dataBytes, 4
    /* Length */
    );
    return blockBytes;
  }
  /**
   * Converts the Python code into the Intel Hex format expected by
   * MicroPython and injects it into a Intel Hex string containing a marker.
   *
   * TODO: Throw error if filesystem is using the penultimate page already.
   *
   * @param intelHex - Single string of Intel Hex records to inject the code.
   * @param pyStr - Python code string.
   * @returns Intel Hex string with the Python code injected.
   */


  function addIntelHexAppendedScript(intelHex, pyCode) {
    var codeBytes = strToBytes(pyCode);
    var blockBytes = createAppendedBlock(codeBytes);

    if (blockBytes.length > 8192
    /* Length */
    ) {
        throw new RangeError('Too long');
      } // Convert to Intel Hex format


    var intelHexClean = cleanseOldHexFormat(intelHex);
    var intelHexMap = MemoryMap.fromHex(intelHexClean);
    intelHexMap.set(253952
    /* StartAdd */
    , blockBytes); // Older versions of DAPLink need the file to end in a new line

    return intelHexMap.asHexString() + '\n';
  }
  /**
   * Checks the Intel Hex memory map to see if there is an appended script.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   * @returns True if appended script is present, false otherwise.
   */


  function isAppendedScriptPresent(intelHex) {
    var intelHexMap;

    if (typeof intelHex === 'string') {
      var intelHexClean = cleanseOldHexFormat(intelHex);
      intelHexMap = MemoryMap.fromHex(intelHexClean);
    } else {
      intelHexMap = intelHex;
    }

    var headerMagic = intelHexMap.slicePad(253952
    /* StartAdd */
    , 2, 0xff);
    return headerMagic[0] === HEADER_START_BYTE_0 && headerMagic[1] === HEADER_START_BYTE_1;
  }

  /**
   * Interprets the data stored in the UICR memory space.
   *
   * For more info:
   * https://microbit-micropython.readthedocs.io/en/latest/devguide/hexformat.html
   */
  var UICR_START = 0x10001000;
  var UICR_CUSTOMER_OFFSET = 0x80;
  var UICR_CUSTOMER_UPY_OFFSET = 0x40;
  var UICR_UPY_START = UICR_START + UICR_CUSTOMER_OFFSET + UICR_CUSTOMER_UPY_OFFSET;
  var UPY_MAGIC_HEADER = 0x17eeb07c;
  var UPY_MAGIC_LEN = 4;
  var UPY_END_MARKER_LEN = 4;
  var UPY_PAGE_SIZE_LEN = 4;
  var UPY_START_PAGE_LEN = 2;
  var UPY_PAGES_USED_LEN = 2;
  var UPY_DELIMITER_LEN = 4;
  var UPY_VERSION_LEN = 4;
  /** UICR Customer area addresses for MicroPython specific data. */

  var MicropythonUicrAddress;

  (function (MicropythonUicrAddress) {
    MicropythonUicrAddress[MicropythonUicrAddress["MagicValue"] = UICR_UPY_START] = "MagicValue";
    MicropythonUicrAddress[MicropythonUicrAddress["EndMarker"] = MicropythonUicrAddress.MagicValue + UPY_MAGIC_LEN] = "EndMarker";
    MicropythonUicrAddress[MicropythonUicrAddress["PageSize"] = MicropythonUicrAddress.EndMarker + UPY_END_MARKER_LEN] = "PageSize";
    MicropythonUicrAddress[MicropythonUicrAddress["StartPage"] = MicropythonUicrAddress.PageSize + UPY_PAGE_SIZE_LEN] = "StartPage";
    MicropythonUicrAddress[MicropythonUicrAddress["PagesUsed"] = MicropythonUicrAddress.StartPage + UPY_START_PAGE_LEN] = "PagesUsed";
    MicropythonUicrAddress[MicropythonUicrAddress["Delimiter"] = MicropythonUicrAddress.PagesUsed + UPY_PAGES_USED_LEN] = "Delimiter";
    MicropythonUicrAddress[MicropythonUicrAddress["VersionLocation"] = MicropythonUicrAddress.Delimiter + UPY_DELIMITER_LEN] = "VersionLocation";
    MicropythonUicrAddress[MicropythonUicrAddress["End"] = MicropythonUicrAddress.VersionLocation + UPY_VERSION_LEN] = "End";
  })(MicropythonUicrAddress || (MicropythonUicrAddress = {}));
  /**
   * Reads a 32 bit little endian number from an Intel Hex memory map.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @param address - Start address of the 32 bit number.
   * @returns Number with the unsigned integer representation of those 4 bytes.
   */


  function getUint32FromIntelHexMap(intelHexMap, address) {
    var uint32Data = intelHexMap.slicePad(address, 4, 0xff); // Typed arrays use the native endianness, force little endian with DataView

    return new DataView(uint32Data.buffer).getUint32(0, true
    /* little endian */
    );
  }
  /**
   * Reads a 16 bit little endian number from an Intel Hex memory map.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @param address - Start address of the 16 bit number.
   * @returns Number with the unsigned integer representation of those 2 bytes.
   */


  function getUint16FromIntelHexMap(intelHexMap, address) {
    var uint16Data = intelHexMap.slicePad(address, 2, 0xff); // Typed arrays use the native endianness, force little endian with DataView

    return new DataView(uint16Data.buffer).getUint16(0, true
    /* little endian */
    );
  }
  /**
   * Decodes a UTF-8 null terminated string stored in the Intel Hex data at
   * the indicated address.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @param address - Start address for the string.
   * @returns String read from the Intel Hex data.
   */


  function getStringFromIntelHexMap(intelHexMap, address) {
    var memBlock = intelHexMap.slice(address).get(address);
    var i = 0;

    for (i = 0; i < memBlock.length && memBlock[i] !== 0; i++) {
    }

    if (i === memBlock.length) {
      // Could not find a null character to indicate the end of the string
      return '';
    }

    var stringBytes = memBlock.slice(0, i);
    return bytesToStr(stringBytes);
  }
  /**
   * Check if the magic number for the MicroPython UICR data is present in the
   * Intel Hex memory map.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @return True if the magic number matches, false otherwise.
   */


  function confirmMagicValue(intelHexMap) {
    var readMagicHeader = getUint32FromIntelHexMap(intelHexMap, MicropythonUicrAddress.MagicValue);
    return readMagicHeader === UPY_MAGIC_HEADER;
  }
  /**
   * Reads the UICR data that contains the flash page size.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @returns The size of each flash page size.
   */


  function getPageSize(intelHexMap) {
    var pageSize = getUint32FromIntelHexMap(intelHexMap, MicropythonUicrAddress.PageSize); // Page size is stored as a log base 2

    return Math.pow(2, pageSize);
  }
  /**
   * Reads the UICR data that contains the start page of the MicroPython runtime.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @returns The start page number of the MicroPython runtime.
   */


  function getStartPage(intelHexMap) {
    return getUint16FromIntelHexMap(intelHexMap, MicropythonUicrAddress.StartPage);
  }
  /**
   * Reads the UICR data that contains the address of the location in flash where
   * the MicroPython version is stored.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @returns The address of the location in flash where the MicroPython version
   * is stored.
   */


  function getPagesUsed(intelHexMap) {
    return getUint16FromIntelHexMap(intelHexMap, MicropythonUicrAddress.PagesUsed);
  }
  /**
   * Reads the UICR data that contains the number of flash pages used by the
   * MicroPython runtime.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @returns The number of pages used by the MicroPython runtime.
   */


  function getVersionLocation(intelHexMap) {
    return getUint32FromIntelHexMap(intelHexMap, MicropythonUicrAddress.VersionLocation);
  }
  /**
   * Reads the UICR data from an Intel Hex map and retrieves the MicroPython data.
   *
   * @throws {Error} When the Magic Header is not present.
   *
   * @param intelHexMap - Memory map of the Intel Hex data.
   * @returns Object with the decoded UICR MicroPython data.
   */


  function getHexMapUicrData(intelHexMap) {
    var uicrMap = intelHexMap.slice(UICR_UPY_START);

    if (!confirmMagicValue(uicrMap)) {
      throw new Error('Could not find valid MicroPython UICR data.');
    }

    var pageSize = getPageSize(uicrMap);
    var startPage = getStartPage(uicrMap);
    var pagesUsed = getPagesUsed(uicrMap);
    var versionAddress = getVersionLocation(uicrMap);
    var version = getStringFromIntelHexMap(intelHexMap, versionAddress);
    return {
      flashPageSize: pageSize,
      runtimeStartPage: startPage,
      runtimeStartAddress: startPage * pageSize,
      runtimeEndUsed: pagesUsed,
      runtimeEndAddress: pagesUsed * pageSize,
      versionAddress: versionAddress,
      version: version
    };
  }
  /**
   * Reads the UICR data from an Intel Hex string and retrieves the MicroPython
   * data.
   *
   * @throws {Error} When the Magic Header is not present.
   *
   * @param intelHex - MicroPython Intel Hex string.
   * @returns Object with the decoded UICR MicroPython data.
   */


  function getIntelHexUicrData(intelHex) {
    return getHexMapUicrData(MemoryMap.fromHex(intelHex));
  }

  /** Sizes for the different parts of the file system chunks. */

  var CHUNK_LEN = 128;
  var CHUNK_MARKER_LEN = 1;
  var CHUNK_TAIL_LEN = 1;
  var CHUNK_DATA_LEN = CHUNK_LEN - CHUNK_MARKER_LEN - CHUNK_TAIL_LEN;
  var CHUNK_HEADER_END_OFFSET_LEN = 1;
  var CHUNK_HEADER_NAME_LEN = 1;
  var MAX_FILENAME_LENGTH = 120;
  /** Flash values for the micro:bit nRF microcontroller. */

  var FLASH_PAGE_SIZE = 1024;
  var FLASH_END = 0x40000;
  /** Size of pages with specific functions. */

  var CALIBRATION_PAGE_SIZE = FLASH_PAGE_SIZE; // ----------------------------------------------------------------------------
  // Massive hack! Use temporarily for predictable start point for tests.
  // Will need to regenerate test data for other initial chunks

  var TEST_START_CHUNK = 0;

  /**
   * Scans the file system area inside the Intel Hex data a returns a list of
   * available chunks.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   * @returns List of all unused chunks.
   */

  function getFreeChunks(intelHexMap) {
    var freeChunks = [];
    var startAddress = getStartAddress(intelHexMap);
    var endAddress = getLastPageAddress(intelHexMap);
    var chunkAddr = startAddress;
    var chunkIndex = 1;

    while (chunkAddr < endAddress) {
      var marker = intelHexMap.slicePad(chunkAddr, 1, 255
      /* Unused */
      )[0];

      if (marker === 255
      /* Unused */
      || marker === 0
      /* Freed */
      ) {
          // TODO: REMOVE MASSIVE HACK TEMPORARILY INCLUDED HERE FOR TESTING
          if (chunkIndex >= TEST_START_CHUNK) {
            freeChunks.push(chunkIndex);
          }
        }

      chunkIndex++;
      chunkAddr += CHUNK_LEN;
    }

    return freeChunks;
  }
  /**
   * Calculates from the input Intel Hex where the MicroPython runtime ends and
   * return that as the start of the filesystem area.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   * @returns Filesystem start address
   */


  function getStartAddress(intelHexMap) {
    var uicrData = getHexMapUicrData(intelHexMap);
    var startAddress = uicrData.runtimeEndAddress; // Ensure the start address aligns with the page size

    if (startAddress % FLASH_PAGE_SIZE) {
      throw new Error('File system start address from UICR does not align with flash page size.');
    }

    return startAddress;
  }
  /**
   * Calculates the end address for the filesystem.
   *
   * Start from the end of flash, or from the top of appended script if
   * one is included in the Intel Hex data.
   * Then move one page up as it is used for the magnetometer calibration data.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   * @returns End address for the filesystem.
   */


  function getEndAddress(intelHexMap) {
    var endAddress = FLASH_END;

    if (isAppendedScriptPresent(intelHexMap)) {
      endAddress = 253952
      /* StartAdd */
      ;
    }

    return endAddress - CALIBRATION_PAGE_SIZE;
  }
  /**
   * Calculates the address for the last page available to the filesystem.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   * @returns Memory address where the last filesystem page starts.
   */


  function getLastPageAddress(intelHexMap) {
    return getEndAddress(intelHexMap) - FLASH_PAGE_SIZE;
  }
  /**
   * If not present already, it sets the persistent page in flash.
   *
   * This page can be located right below right on top or below the filesystem
   * space.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   */


  function setPersistentPage(intelHexMap) {
    // TODO: This could be the first or the last page. Check first if it exists,
    // if it doesn't then randomise its location.
    intelHexMap.set(getLastPageAddress(intelHexMap), new Uint8Array([253
    /* PersistentData */
    ]));
  }
  /**
   * Calculate the flash memory address from the chunk index.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   * @param chunkIndex - Index for the chunk to calculate.
   * @returns Address in flash for the chunk.
   */


  function chuckIndexAddress(intelHexMap, chunkIndex) {
    // Chunk index starts at 1, so we need to account for that in the calculation
    return getStartAddress(intelHexMap) + (chunkIndex - 1) * CHUNK_LEN;
  }
  /**
   * Class to contain file data and generate its MicroPython filesystem
   * representation.
   */


  var FsFile =
  /** @class */
  function () {
    /**
     * Create a file.
     *
     * @param filename - Name for the file.
     * @param data - Byte array with the file data.
     */
    function FsFile(filename, data) {
      this._filename = filename;
      this._filenameBytes = strToBytes(filename);

      if (this._filenameBytes.length > MAX_FILENAME_LENGTH) {
        throw new Error("File name \"" + filename + "\" is too long " + ("(max " + MAX_FILENAME_LENGTH + " characters)."));
      }

      this._dataBytes = data; // Generate a single byte array with the filesystem data bytes.

      var fileHeader = this.generateFileHeaderBytes();
      this._fsDataBytes = new Uint8Array(fileHeader.length + this._dataBytes.length);

      this._fsDataBytes.set(fileHeader, 0);

      this._fsDataBytes.set(this._dataBytes, fileHeader.length);
    }
    /**
     * Generates a byte array for the file header as expected by the MicroPython
     * file system.
     *
     * @return Byte array with the header data.
     */


    FsFile.prototype.generateFileHeaderBytes = function () {
      var headerSize = CHUNK_HEADER_END_OFFSET_LEN + CHUNK_HEADER_NAME_LEN + this._filenameBytes.length;
      var endOffset = (headerSize + this._dataBytes.length) % CHUNK_DATA_LEN;
      var fileNameOffset = headerSize - this._filenameBytes.length; // Format header byte array

      var headerBytes = new Uint8Array(headerSize);
      headerBytes[1
      /* EndOffset */
      - 1] = endOffset;
      headerBytes[2
      /* NameLength */
      - 1] = this._filenameBytes.length;

      for (var i = fileNameOffset; i < headerSize; ++i) {
        headerBytes[i] = this._filenameBytes[i - fileNameOffset];
      }

      return headerBytes;
    };
    /**
     * Generate an array of file system chunks for all this file content.
     *
     * @throws {Error} When there are not enough chunks available.
     *
     * @param freeChunks - List of available chunks to use.
     * @returns An array of byte arrays, one item per chunk.
     */


    FsFile.prototype.getFsChunks = function (freeChunks) {
      // Now form the chunks
      var chunks = [];
      var freeChunksIndex = 0;
      var dataIndex = 0; // Prepare first chunk where the marker indicates a file start

      var chunk = new Uint8Array(CHUNK_LEN).fill(0xff);
      chunk[0
      /* Marker */
      ] = 254
      /* FileStart */
      ;
      var loopEnd = Math.min(this._fsDataBytes.length, CHUNK_DATA_LEN);

      for (var i = 0; i < loopEnd; i++, dataIndex++) {
        chunk[CHUNK_MARKER_LEN + i] = this._fsDataBytes[dataIndex];
      }

      chunks.push(chunk); // The rest of the chunks follow the same pattern

      while (dataIndex < this._fsDataBytes.length) {
        freeChunksIndex++;

        if (freeChunksIndex >= freeChunks.length) {
          throw new Error("Not enough space for the " + this._filename + " file.");
        } // The previous chunk has to be followed by this one, so add this index


        var previousChunk = chunks[chunks.length - 1];
        previousChunk[127
        /* Tail */
        ] = freeChunks[freeChunksIndex];
        chunk = new Uint8Array(CHUNK_LEN).fill(0xff); // This chunk Marker points to the previous chunk

        chunk[0
        /* Marker */
        ] = freeChunks[freeChunksIndex - 1]; // Add the data to this chunk

        loopEnd = Math.min(this._fsDataBytes.length - dataIndex, CHUNK_DATA_LEN);

        for (var i = 0; i < loopEnd; i++, dataIndex++) {
          chunk[CHUNK_MARKER_LEN + i] = this._fsDataBytes[dataIndex];
        }

        chunks.push(chunk);
      }

      return chunks;
    };
    /**
     * Generate a single byte array with the filesystem data for this file.
     *
     * @param freeChunks - List of available chunks to use.
     * @returns A byte array with the data to go straight into flash.
     */


    FsFile.prototype.getFsBytes = function (freeChunks) {
      var chunks = this.getFsChunks(freeChunks);
      var chunksLen = chunks.length * CHUNK_LEN;
      var fileFsBytes = new Uint8Array(chunksLen);

      for (var i = 0; i < chunks.length; i++) {
        fileFsBytes.set(chunks[i], CHUNK_LEN * i);
      }

      return fileFsBytes;
    };
    /**
     * @returns Size, in bytes, of how much space the file takes in the filesystem
     *     flash memory.
     */


    FsFile.prototype.getFsFileSize = function () {
      var chunksUsed = Math.ceil(this._fsDataBytes.length / CHUNK_DATA_LEN); // When MicroPython uses up to the last byte of the last chunk it will
      // still consume the next chunk, even if it doesn't add any data to it

      if (!(this._fsDataBytes.length % CHUNK_DATA_LEN)) {
        chunksUsed += 1;
      }

      return chunksUsed * CHUNK_LEN;
    };

    return FsFile;
  }();
  /**
   * @returns Size, in bytes, of how much space the file would take in the
   *     MicroPython filesystem.
   */


  function calculateFileSize(filename, data) {
    var file = new FsFile(filename, data);
    return file.getFsFileSize();
  }
  /**
   * Adds a byte array as a file to a MicroPython Memory Map.
   *
   * @throws {Error} When the invalid file name is given.
   * @throws {Error} When the the file doesn't have any data.
   * @throws {Error} When there are issues calculating the file system boundaries.
   * @throws {Error} When there is no space left for the file.
   *
   * @param intelHexMap - Memory map for the MicroPython Intel Hex.
   * @param filename - Name for the file.
   * @param data - Byte array for the file data.
   * @returns MicroPython Memory map with the file in the filesystem.
   */


  function addMemMapFile(intelHexMap, filename, data) {
    if (!filename) throw new Error('File has to have a file name.');
    if (!data.length) throw new Error("File " + filename + " has to contain data.");
    var freeChunks = getFreeChunks(intelHexMap);

    if (freeChunks.length === 0) {
      throw new Error('There is no storage space left.');
    }

    var chunksStartAddress = chuckIndexAddress(intelHexMap, freeChunks[0]); // Create a file, generate and inject filesystem data.

    var fsFile = new FsFile(filename, data);
    var fileFsBytes = fsFile.getFsBytes(freeChunks);
    intelHexMap.set(chunksStartAddress, fileFsBytes);
    setPersistentPage(intelHexMap);
    return intelHexMap;
  }
  /**
   * Adds a hash table of filenames and byte arrays as files to the MicroPython
   * filesystem.
   *
   * @throws {Error} When the an invalid file name is given.
   * @throws {Error} When the a file doesn't have any data.
   * @throws {Error} When there are issues calculating the file system boundaries.
   * @throws {Error} When there is no space left for a file.
   *
   * @param intelHex - MicroPython Intel Hex string.
   * @param files - Hash table with filenames as the key and byte arrays as the
   *     value.
   * @returns MicroPython Intel Hex string with the file in the filesystem.
   */


  function addIntelHexFiles(intelHex, files) {
    var intelHexClean = cleanseOldHexFormat(intelHex);
    var intelHexMap = MemoryMap.fromHex(intelHexClean);
    Object.keys(files).forEach(function (filename) {
      intelHexMap = addMemMapFile(intelHexMap, filename, files[filename]);
    });
    return intelHexMap.asHexString() + '\n';
  }
  /**
   * Reads the filesystem included in a MicroPython Intel Hex string.
   *
   * @throws {Error} When multiple files with the same name encountered.
   * @throws {Error} When a file chunk points to an unused chunk.
   * @throws {Error} When a file chunk marker does not point to previous chunk.
   * @throws {Error} When following through the chunks linked list iterates
   *     through more chunks and used chunks (sign of an infinite loop).
   *
   * @param intelHex - The MicroPython Intel Hex string to read from.
   * @returns Dictionary with the filename as key and byte array as values.
   */


  function getIntelHexFiles(intelHex) {
    var intelHexClean = cleanseOldHexFormat(intelHex);
    var hexMap = MemoryMap.fromHex(intelHexClean);
    var startAddress = getStartAddress(hexMap);
    var endAddress = getLastPageAddress(hexMap); // TODO: endAddress as the getLastPageAddress works now because this
    // library uses the last page as the "persistent" page, so the filesystem does
    // end there. In reality, the persistent page could be the first or the last
    // page, so we should get the end address as the magnetometer page and then
    // check if the persistent marker is present in the first of last page and take that
    // into account in the memory range calculation.
    // Note that the persistent marker is only present at the top of the page
    // Iterate through the filesystem to collect used chunks and file starts

    var usedChunks = {};
    var startChunkIndexes = [];
    var chunkAddr = startAddress;
    var chunkIndex = 1;

    while (chunkAddr < endAddress) {
      var chunk = hexMap.slicePad(chunkAddr, CHUNK_LEN, 255
      /* Unused */
      );
      var marker = chunk[0];

      if (marker !== 255
      /* Unused */
      && marker !== 0
      /* Freed */
      && marker !== 253
      /* PersistentData */
      ) {
          usedChunks[chunkIndex] = chunk;

          if (marker === 254
          /* FileStart */
          ) {
              startChunkIndexes.push(chunkIndex);
            }
        }

      chunkIndex++;
      chunkAddr += CHUNK_LEN;
    } // Go through the list of file-starts, follow the file chunks and collect data


    var files = {};

    for (var _i = 0, startChunkIndexes_1 = startChunkIndexes; _i < startChunkIndexes_1.length; _i++) {
      var startChunkIndex = startChunkIndexes_1[_i];
      var startChunk = usedChunks[startChunkIndex];
      var endChunkOffset = startChunk[1
      /* EndOffset */
      ];
      var filenameLen = startChunk[2
      /* NameLength */
      ]; // 1st byte is the marker, 2nd is the offset, 3rd is the filename length

      var chunkDataStart = 3 + filenameLen;
      var filename = bytesToStr(startChunk.slice(3, chunkDataStart));

      if (files.hasOwnProperty(filename)) {
        throw new Error("Found multiple files named: " + filename + ".");
      }

      files[filename] = new Uint8Array(0);
      var currentChunk = startChunk;
      var currentIndex = startChunkIndex; // Chunks are basically a double linked list, so invalid data could create
      // an infinite loop. No file should traverse more chunks than available.

      var iterations = Object.keys(usedChunks).length + 1;

      while (iterations--) {
        var nextIndex = currentChunk[127
        /* Tail */
        ];

        if (nextIndex === 255
        /* Unused */
        ) {
            // The current chunk is the last
            files[filename] = concatUint8Array(files[filename], currentChunk.slice(chunkDataStart, 1 + endChunkOffset));
            break;
          } else {
          files[filename] = concatUint8Array(files[filename], currentChunk.slice(chunkDataStart, 127
          /* Tail */
          ));
        }

        var nextChunk = usedChunks[nextIndex];

        if (!nextChunk) {
          throw new Error("Chunk " + currentIndex + " points to unused index " + nextIndex + ".");
        }

        if (nextChunk[0
        /* Marker */
        ] !== currentIndex) {
          throw new Error("Chunk index " + nextIndex + " did not link to previous chunk index " + currentIndex + ".");
        }

        currentChunk = nextChunk;
        currentIndex = nextIndex; // Start chunk data has a unique start, all others start after marker

        chunkDataStart = 1;
      }

      if (iterations <= 0) {
        // We iterated through chunks more often than available chunks
        throw new Error('Malformed file chunks did not link correctly.');
      }
    }

    return files;
  }
  /**
   * Calculate the MicroPython filesystem size.
   *
   * @param intelHex - The MicroPython Intel Hex string.
   * @returns Size of the filesystem in bytes.
   */


  function getIntelHexFsSize(intelHex) {
    var intelHexClean = cleanseOldHexFormat(intelHex);
    var intelHexMap = MemoryMap.fromHex(intelHexClean);
    var startAddress = getStartAddress(intelHexMap);
    var endAddress = getEndAddress(intelHexMap); // Remember that one page is used as persistent page

    return endAddress - startAddress - FLASH_PAGE_SIZE;
  }

  var SimpleFile =
  /** @class */
  function () {
    /**
     * Create a SimpleFile.
     *
     * @throws {Error} When an invalid filename is provided.
     * @throws {Error} When invalid file data is provided.
     *
     * @param filename - Name for the file.
     * @param data - String or byte array with the file data.
     */
    function SimpleFile(filename, data) {
      if (!filename) {
        throw new Error('File was not provided a valid filename.');
      }

      if (!data) {
        throw new Error("File " + filename + " does not have valid content.");
      }

      this.filename = filename;

      if (typeof data === 'string') {
        this._dataBytes = strToBytes(data);
      } else if (data instanceof Uint8Array) {
        this._dataBytes = data;
      } else {
        throw new Error('File data type must be a string or Uint8Array.');
      }
    }

    SimpleFile.prototype.getText = function () {
      return bytesToStr(this._dataBytes);
    };

    SimpleFile.prototype.getBytes = function () {
      return this._dataBytes;
    };

    return SimpleFile;
  }();

  var MicropythonFsHex =
  /** @class */
  function () {
    /**
     * File System manager constructor.
     * At the moment it needs a MicroPython hex string without a files included.
     *
     * TODO: If files are already in input hex file, deal with them somehow.
     *
     * @param intelHex - MicroPython Intel Hex string.
     */
    function MicropythonFsHex(intelHex) {
      this._files = {};
      this._intelHex = intelHex;
      this.importFilesFromIntelHex(this._intelHex);

      if (this.ls().length) {
        throw new Error('There are files in the MicropythonFsHex constructor hex file input.');
      }
    }
    /**
     * Create a new file and add it to the file system.
     *
     * @throws {Error} When the file already exists.
     * @throws {Error} When an invalid filename is provided.
     * @throws {Error} When invalid file data is provided.
     *
     * @param filename - Name for the file.
     * @param content - File content to write.
     */


    MicropythonFsHex.prototype.create = function (filename, content) {
      if (this.exists(filename)) {
        throw new Error('File already exists.');
      }

      this.write(filename, content);
    };
    /**
     * Write a file into the file system. Overwrites a previous file with the
     * same name.
     *
     * @throws {Error} When an invalid filename is provided.
     * @throws {Error} When invalid file data is provided.
     *
     * @param filename - Name for the file.
     * @param content - File content to write.
     */


    MicropythonFsHex.prototype.write = function (filename, content) {
      this._files[filename] = new SimpleFile(filename, content);
    };

    MicropythonFsHex.prototype.append = function (filename, content) {
      if (!filename) {
        throw new Error('Invalid filename.');
      }

      if (!this.exists(filename)) {
        throw new Error("File \"" + filename + "\" does not exist.");
      } // TODO: Implement this.


      throw new Error('Append operation not yet implemented.');
    };
    /**
     * Read the text from a file.
     *
     * @throws {Error} When invalid file name is provided.
     * @throws {Error} When file is not in the file system.
     *
     * @param filename - Name of the file to read.
     * @returns Text from the file.
     */


    MicropythonFsHex.prototype.read = function (filename) {
      if (!filename) {
        throw new Error('Invalid filename.');
      }

      if (!this.exists(filename)) {
        throw new Error("File \"" + filename + "\" does not exist.");
      }

      return this._files[filename].getText();
    };
    /**
     * Read the bytes from a file.
     *
     * @throws {Error} When invalid file name is provided.
     * @throws {Error} When file is not in the file system.
     *
     * @param filename - Name of the file to read.
     * @returns Byte array from the file.
     */


    MicropythonFsHex.prototype.readBytes = function (filename) {
      if (!filename) {
        throw new Error('Invalid filename.');
      }

      if (!this.exists(filename)) {
        throw new Error("File \"" + filename + "\" does not exist.");
      }

      return this._files[filename].getBytes();
    };
    /**
     * Delete a file from the file system.
     *
     * @throws {Error} When invalid file name is provided.
     * @throws {Error} When the file doesn't exist.
     *
     * @param filename - Name of the file to delete.
     */


    MicropythonFsHex.prototype.remove = function (filename) {
      if (!filename) {
        throw new Error('Invalid filename.');
      }

      if (!this.exists(filename)) {
        throw new Error("File \"" + filename + "\" does not exist.");
      }

      delete this._files[filename];
    };
    /**
     * Check if a file is already present in the file system.
     *
     * @param filename - Name for the file to check.
     * @returns True if it exists, false otherwise.
     */


    MicropythonFsHex.prototype.exists = function (filename) {
      return this._files.hasOwnProperty(filename);
    };
    /**
     * Returns the size of a file in bytes.
     *
     * @throws {Error} When invalid file name is provided.
     * @throws {Error} When the file doesn't exist.
     *
     * @param filename - Name for the file to check.
     * @returns Size file size in bytes.
     */


    MicropythonFsHex.prototype.size = function (filename) {
      if (!filename) {
        throw new Error('Invalid filename.');
      }

      if (!this.exists(filename)) {
        throw new Error("File \"" + filename + "\" does not exist.");
      }

      return calculateFileSize(this._files[filename].filename, this._files[filename].getBytes());
    };
    /**
     * @returns A list all the files in the file system.
     */


    MicropythonFsHex.prototype.ls = function () {
      var files = [];
      Object.values(this._files).forEach(function (value) {
        return files.push(value.filename);
      });
      return files;
    };
    /**
     * Read the files included in a MicroPython hex string and add them to this
     * instance.
     *
     * @throws {Error} When there is a problem reading the files from the hex.
     * @throws {Error} When a filename already exists in this instance (all other
     *     files are still imported).
     *
     * @param intelHex - MicroPython hex string with files.
     * @param overwrite - Flag to overwrite existing files in this instance.
     * @param formatFirst - Erase all the previous files before importing. It only
     *     erases the files after there are no error during hex file parsing.
     * @returns A filename list of added files.
     */


    MicropythonFsHex.prototype.importFilesFromIntelHex = function (intelHex, overwrite, formatFirst) {
      var _this = this;

      var files = getIntelHexFiles(intelHex);

      if (formatFirst) {
        delete this._files;
        this._files = {};
      }

      var existingFiles = [];
      Object.keys(files).forEach(function (filename) {
        if (!overwrite && _this.exists(filename)) {
          existingFiles.push(filename);
        } else {
          _this.write(filename, files[filename]);
        }
      }); // Only throw the error at the end so that all other files are imported

      if (existingFiles.length) {
        throw new Error("Files \"" + existingFiles + "\" from hex already exists.");
      }

      return Object.keys(files);
    };
    /**
     * Generate a new copy of the MicroPython Intel Hex with the filesystem
     * included.
     *
     * @throws {Error} When a file doesn't have any data.
     * @throws {Error} When there are issues calculating file system boundaries.
     * @throws {Error} When there is no space left for a file.
     *
     * @param intelHex - Optionally provide a different Intel Hex to include the
     *    filesystem into.
     * @returns A new string with MicroPython and the filesystem included.
     */


    MicropythonFsHex.prototype.getIntelHex = function (intelHex) {
      var finalHex = intelHex || this._intelHex;
      var files = {};
      Object.values(this._files).forEach(function (file) {
        files[file.filename] = file.getBytes();
      });
      return addIntelHexFiles(finalHex, files);
    };
    /**
     * Calculate the MicroPython filesystem total size.
     *
     * @returns Size of the filesystem in bytes.
     */


    MicropythonFsHex.prototype.getFsSize = function () {
      return getIntelHexFsSize(this._intelHex);
    };

    return MicropythonFsHex;
  }();

  exports.addIntelHexAppendedScript = addIntelHexAppendedScript;
  exports.getIntelHexAppendedScript = getIntelHexAppendedScript;
  exports.isAppendedScriptPresent = isAppendedScriptPresent;
  exports.MicropythonFsHex = MicropythonFsHex;
  exports.getHexMapUicrData = getHexMapUicrData;
  exports.getIntelHexUicrData = getIntelHexUicrData;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=microbit-fs.umd.js.map
